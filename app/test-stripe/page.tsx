"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionButtons } from "@/components/pricing-buttons";
import { SubmissionPackButton } from "@/components/submission-pack-buttons";
import { createClient } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export default function TestStripePage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [testUserId, setTestUserId] = useState<string>("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user && !error) {
        setCurrentUser(user);
        setTestUserId(user.id);
        console.log('Current user ID:', user.id);
      } else {
        console.log('No user logged in or error:', error);
      }
      setAuthLoading(false);
    };

    getCurrentUser();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch('/api/test-users');
      const data = await response.json();
      
      if (response.ok) {
        setAvailableUsers(data.users);
      } else {
        alert(`Error fetching users: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users from database');
    } finally {
      setUsersLoading(false);
    }
  };

  const testStripeConnection = () => {
    alert("Stripe connection test - environment variables logged to console");
    console.log("Environment Variables:", envVars);
  };

  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Current User</CardTitle>
          <CardDescription>
            Automatically detected logged-in user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentUser ? (
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-semibold">Email:</span> {currentUser.email}
              </div>
              <div className="text-sm">
                <span className="font-semibold">User ID:</span> 
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{currentUser.id}</code>
              </div>
              <div className="text-green-600 text-sm">
                ✓ Ready for Stripe checkout
              </div>
            </div>
          ) : (
            <div className="text-red-600 text-sm">
              ✗ Not logged in - please log in to test Stripe checkout
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Alternative Users</CardTitle>
          <CardDescription>
            Fetch other user IDs from your database for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={fetchUsers} 
            disabled={usersLoading}
            className="w-full"
          >
            {usersLoading ? 'Loading Users...' : 'Fetch Users from Database'}
          </Button>
          
          {availableUsers.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Select a user for testing:</h4>
              <select 
                value={testUserId} 
                onChange={(e) => setTestUserId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {currentUser && (
                  <option value={currentUser.id}>
                    {currentUser.email} (Current User) - {currentUser.id}
                  </option>
                )}
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} ({user.name || 'No name'}) - {user.id}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="font-semibold">Or enter a user ID manually:</h4>
            <input
              type="text"
              placeholder="Enter user ID for testing..."
              value={testUserId}
              onChange={(e) => setTestUserId(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {testUserId && (
            <div className="text-sm text-green-600">
              ✓ Using User ID: <code className="bg-gray-100 px-2 py-1 rounded">{testUserId}</code>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Test the subscription checkout buttons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionButtons userId={testUserId} />
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submission Packs</CardTitle>
          <CardDescription>
            Test the one-time purchase buttons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SubmissionPackButton
            userId={testUserId}
            packType="single"
            price="$4.99"
            submissions={1}
          />
          <SubmissionPackButton
            userId={testUserId}
            packType="bundle_5"
            price="$19.99"
            submissions={5}
          />
          <SubmissionPackButton
            userId={testUserId}
            packType="bundle_10"
            price="$34.99"
            submissions={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
