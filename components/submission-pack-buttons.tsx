"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubmissionPackButtonProps {
  userId?: string;
  packType: 'single' | 'bundle_5' | 'bundle_10';
  price: string;
  submissions: number;
}

export function SubmissionPackButton({ userId, packType, price, submissions }: SubmissionPackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      // Placeholder for Stripe integration
      alert(`Starting purchase of ${submissions} submission${submissions > 1 ? 's' : ''} for ${price}...`);
      console.log(`Would create Stripe checkout for ${packType} pack`);
      console.log(`User ID: ${userId}, Pack: ${packType}, Price: ${price}`);
      
      // TODO: Replace with actual Stripe checkout
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ packType, userId, productType: 'submission_pack' })
      // });
      // const { url } = await response.json();
      // window.location.href = url;
      
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Error starting purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Processing...' : `Buy ${submissions} Submission${submissions > 1 ? 's' : ''} - ${price}`}
    </Button>
  );
}
