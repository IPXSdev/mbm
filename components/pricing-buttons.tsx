"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubscriptionButtonsProps {
  userId?: string;
  currentPlan?: string;
}

export function SubscriptionButtons({ userId, currentPlan }: SubscriptionButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscription = async (planType: 'creator' | 'pro') => {
    if (!userId) {
      alert('Please log in to subscribe');
      return;
    }

    setLoading(planType);
    
    try {
      console.log(`Creating Stripe checkout for ${planType} plan with user ID: ${userId}`);
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planType, 
          userId,
          productType: 'subscription'
        })
      });

      const data = await response.json();
      console.log('Stripe API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Error starting subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => handleSubscription('creator')}
        disabled={loading === 'creator' || !userId}
        className="w-full"
        variant={currentPlan === 'creator' ? 'secondary' : 'default'}
      >
        {loading === 'creator' ? 'Processing...' : 'Creator Plan - $19.99/month'}
      </Button>
      
      <Button
        onClick={() => handleSubscription('pro')}
        disabled={loading === 'pro' || !userId}
        className="w-full"
        variant={currentPlan === 'pro' ? 'secondary' : 'default'}
      >
        {loading === 'pro' ? 'Processing...' : 'Pro Plan - $24.99/month'}
      </Button>
      
      {!userId && (
        <div className="text-sm text-red-600 text-center">
          Please log in to subscribe
        </div>
      )}
    </div>
  );
}
