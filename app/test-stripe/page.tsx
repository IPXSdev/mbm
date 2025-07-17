"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestStripePage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check environment variables
    const vars = {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV
    };
    
    setEnvVars(vars);
    setLoading(false);
  }, []);

  const testStripeConnection = () => {
    alert("Stripe connection test - environment variables logged to console");
    console.log("Environment Variables:", envVars);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading environment variables...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Stripe Integration Test</CardTitle>
          <CardDescription>
            Testing environment variables and Stripe connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Environment Variables:</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-mono">{key}:</span>
                  <span className={value ? "text-green-600" : "text-red-600"}>
                    {value ? "✓ Set" : "✗ Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={testStripeConnection} className="w-full">
            Test Stripe Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
