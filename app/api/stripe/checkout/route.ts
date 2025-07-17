import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { planType, userId, productType = 'subscription' } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let sessionParams: Stripe.Checkout.SessionCreateParams;

    if (productType === 'subscription') {
      // Subscription plans
      const priceIds = {
        creator: 'price_1QhxcQBNEktWEKLUMqOSLJcD', // $19.99/month
        pro: 'price_1QhxdEBNEktWEKLUhJKgwEsG'     // $24.99/month
      };

      sessionParams = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceIds[planType as keyof typeof priceIds],
            quantity: 1,
          },
        ],
        customer_email: user.email,
        metadata: {
          userId,
          planType,
          productType: 'subscription'
        },
        success_url: `${req.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.nextUrl.origin}/pricing`,
      };
    } else {
      // One-time submission packs
      const packPrices = {
        single: { price: 499, name: '1 Submission' },      // $4.99
        bundle_5: { price: 1999, name: '5 Submissions' },  // $19.99
        bundle_10: { price: 3499, name: '10 Submissions' } // $34.99
      };

      const pack = packPrices[planType as keyof typeof packPrices];
      if (!pack) {
        return NextResponse.json({ error: 'Invalid pack type' }, { status: 400 });
      }

      sessionParams = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${pack.name} - Man Behind the Music`,
              },
              unit_amount: pack.price,
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        metadata: {
          userId,
          packType: planType,
          productType: 'submission_pack'
        },
        success_url: `${req.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.nextUrl.origin}/store`,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
