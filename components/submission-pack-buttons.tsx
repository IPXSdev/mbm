"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SubmissionPackButtonProps {
  userId?: string;
  packType: 'single' | 'bundle_5' | 'bundle_10';
  price: string;
  submissions: number;
}

export function SubmissionPackButton({ userId, packType, price, submissions }: SubmissionPackButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    if (!userId) {
      // Redirect to signup with next param
      router.push(`/signup?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);

    try {
      console.log(`Creating Stripe checkout for ${packType} pack with user ID: ${userId}`);

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: packType,
          userId,
          productType: 'submission_pack'
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
      console.error('Purchase error:', error);
      alert(`Error starting purchase: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Buy ${submissions} Submission${submissions > 1 ? 's' : ''} - ${price}`}
      </Button>
    </div>
  );
}