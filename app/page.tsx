"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Upload, Headphones, Star, Tv, Users, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SubscriptionButtons } from "@/components/pricing-buttons";
import { SubmissionPackButton } from "@/components/submission-pack-buttons";

function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function HomePage() {
  const supabaseConfigured = isSupabaseConfigured();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
        console.log("Supabase user ID:", data.user.id); // Debug log
      } else {
        setUserId(undefined);
        console.log("No Supabase user found");
      }
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Environment Warning */}
      {!supabaseConfigured && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Supabase environment variables not configured</span>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/setup">Setup Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Video Banner */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/placeholder.svg?height=600&width=1200"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Woody%20McClain%20GHOST%20-plXyRoCTuGRz24UxzqSi25vMfqoY9D.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <Image
            src="/images/logo.png"
            alt="The Man Behind The Music"
            width={800}
            height={400}
            className="mx-auto mb-4 w-full max-w-4xl h-auto"
          />
          <h1 className="text-3xl md:text-5xl font-bold mb-2">GET YOUR MUSIC PLACED IN PREMIUM MEDIA</h1>
          <p className="text-xl md:text-2xl mb-1 text-gray-200">
            Connect directly with A&Rs. Get your music tested for sync opportunities.
          </p>
          <p className="text-lg md:text-xl mb-3 text-gray-300">
            Join the platform where indie artists get real placement opportunities in premium entertainment content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href={supabaseConfigured ? "/pricing" : "/setup"}>
                <Star className="mr-2 h-5 w-5" />
                {supabaseConfigured ? "Start Your Journey" : "Setup Required"}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              asChild
            >
              <Link href="/podcast">
                <Play className="mr-2 h-5 w-5" />
                Watch Podcast
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* ...rest of your page code... */}
    </div>
  );
}