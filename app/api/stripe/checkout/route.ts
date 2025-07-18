import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let stripe: Stripe | null = null;
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, {
    apiVersion: '2024-12-18.acacia',
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      console.error('Stripe secret key missing');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!supabaseUrl || !serviceKey) {
      console.error('Supabase credentials missing');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const { planType, userId, productType = 'subscription' } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
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
        creator: 'price_1RlNOzBgDMz6aj4lHmgcVgJS',
        indie: 'price_1RlNJeBgDMz6aj4l8fdmlTLO',
        pro: 'price_1RlNLdBgDMz6aj4lzZuZuGcg'
      } as const;

      const priceId = priceIds[planType as keyof typeof priceIds];
      if (!priceId) {
        return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
      }

      sessionParams = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
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
      const packPriceIds = {
        single: {
          priceId: 'price_1RlNS6BgDMz6aj4l3YHD8Gm2',
          name: 'Platinum Bundle +4'
        },
        bundle_5: {
          priceId: 'price_1RlNRIBgDMz6aj4lRwI51D64',
          name: 'Gold Bundle +2'
        },
        bundle_10: {
          priceId: 'price_1RlNQEBgDMz6aj4lu54v9JTX',
          name: 'Silver Select +1'
        }
      } as const;

      const pack = packPriceIds[planType as keyof typeof packPriceIds];
      if (!pack) {
        return NextResponse.json({ error: 'Invalid pack type' }, { status: 400 });
      }

      sessionParams = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: pack.priceId,
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