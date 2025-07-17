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
      router.push(`/signup?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);

    try {
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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error) {
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

      {!userId && (
        <div className="flex flex-col items-center space-y-2 mt-2">
          <span className="text-sm text-red-600 text-center">
            Please <span className="font-semibold">login</span> or <span className="font-semibold">signup</span> to subscribe
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`)}>
              Login
            </Button>
            <Button variant="outline" onClick={() => router.push(`/signup?next=${encodeURIComponent(window.location.pathname)}`)}>
              Signup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}