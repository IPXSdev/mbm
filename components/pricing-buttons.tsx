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
    setLoading(planType);
    
    try {
      // Placeholder for Stripe integration
      alert(`Starting ${planType} subscription checkout...`);
      console.log(`Would create Stripe checkout for ${planType} plan`);
      console.log(`User ID: ${userId}, Current Plan: ${currentPlan}`);
      
      // TODO: Replace with actual Stripe checkout
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ planType, userId })
      // });
      // const { url } = await response.json();
      // window.location.href = url;
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Error starting subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => handleSubscription('creator')}
        disabled={loading === 'creator'}
        className="w-full"
        variant={currentPlan === 'creator' ? 'secondary' : 'default'}
      >
        {loading === 'creator' ? 'Processing...' : 'Creator Plan - $19.99/month'}
      </Button>
      
      <Button
        onClick={() => handleSubscription('pro')}
        disabled={loading === 'pro'}
        className="w-full"
        variant={currentPlan === 'pro' ? 'secondary' : 'default'}
      >
        {loading === 'pro' ? 'Processing...' : 'Pro Plan - $24.99/month'}
      </Button>
    </div>
  );
}
