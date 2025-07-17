"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap, Crown, Play, Users, Headphones } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubscriptionButtons } from "@/components/pricing-buttons";
import { SubmissionPackButton } from "@/components/submission-pack-buttons";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Get a taste of industry access",
    icon: Star,
    features: [
      "Access select podcast clips",
      "Watch exclusive behind-the-scenes sneak peeks",
      "Stay up to date with artist placement news & announcements",
    ],
    limitations: ["Limited content access", "No music submission", "No A&R feedback"],
    popular: false,
    cta: "Start Free",
    tier: "TIER 1",
  },
  {
    name: "Creator",
    price: 19.99,
    description: "Get your music in front of A&Rs",
    icon: Zap,
    features: [
      "Submit 1 song per month for pro feedback",
      "Get extended behind-the-scenes access",
      "Your music will be played for A&Rs",
      "Music matched against premium content scenes to test sync fit",
      "Reviewed in deep-dive breakdowns with the hosts",
      "Be eligible for sync opportunities & more",
    ],
    limitations: [],
    popular: true,
    cta: "Start Creating",
    tier: "TIER 2",
  },
  {
    name: "Pro",
    price: 24.99,
    description: "Maximum exposure & industry access",
    icon: Crown,
    features: [
      "Submit up to 2 songs/month",
      "Unlock ALL behind-the-scenes footage",
      "Music reviewed by A&Rs",
      "Music tested against sync scenes",
      "Receive detailed breakdowns with production insight",
      "Weekly DJ sets featuring subscriber music",
      "Hosted by Big Tank, Rockwilder, and Mr. Porter",
      "Your songs spun live. Your name in the mix.",
    ],
    limitations: [],
    popular: false,
    cta: "Go Pro",
    tier: "TIER 3",
  },
];

export default function PricingPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Path to Placement</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get your music in front of A&Rs and tested for sync opportunities in premium entertainment productions
        </p>
      </div>

      {/* Industry Credibility */}
      <div className="text-center mb-12 p-6 bg-gradient-to-r from-purple-900 to-black text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Featuring Industry Heavyweights</h2>
        <div className="flex flex-wrap justify-center gap-4 text-lg">
          <Badge variant="secondary" className="bg-white text-black">Big Tank</Badge>
          <Badge variant="secondary" className="bg-white text-black">Rockwilder</Badge>
          <Badge variant="secondary" className="bg-white text-black">Mr. Porter</Badge>
        </div>
        <p className="mt-4 text-gray-300">The same A&Rs who decide what music gets placed in premium entertainment content</p>
      </div>

      {/* Subscription Plans (Stripe Buttons) */}
      <div className="mb-12">
        <SubscriptionButtons userId={userId} />
      </div>

      {/* Pricing Cards (for display only, no Stripe buttons) */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${plan.popular ? "border-purple-500 shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                <Badge variant="outline" className="w-fit mx-auto mb-2">{plan.tier}</Badge>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? "bg-purple-600 text-white" : "bg-muted"}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">What's Included</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Submission Packs (Stripe Buttons) */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Need More Submissions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Purchase additional submission credits that roll over until used. Perfect for when inspiration strikes!
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <SubmissionPackButton userId={userId} packType="single" price="5" submissions={1} />
          <SubmissionPackButton userId={userId} packType="bundle_5" price="10" submissions={2} />
          <SubmissionPackButton userId={userId} packType="bundle_10" price="15" submissions={4} />
        </div>
      </div>
    </div>
  );
}