"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music, Eye, EyeOff, AlertCircle, Settings } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)
  const router = useRouter()

  // Check if Supabase is properly configured
  useEffect(() => {
    const checkSupabaseConfig = () => {
      // Only check on client side
      if (typeof window === "undefined") return

      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log("🔍 Environment Check:")
      console.log("NEXT_PUBLIC_SUPABASE_URL:", hasUrl ? "✅ Found" : "❌ Missing")
      console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", hasKey ? "✅ Found" : "❌ Missing")

      if (!hasUrl || !hasKey) {
        setIsSupabaseConfigured(false)
        setError("Supabase is not configured. Please complete the setup process.")
        setIsCheckingAuth(false)
        return false
      }

      setIsSupabaseConfigured(true)
      return true
    }

    if (!checkSupabaseConfig()) {
      return
    }

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Auth check error:", error)
      }
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Please complete the setup first.")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      console.log("🔐 Attempting login for:", email)

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authError) {
        console.error("❌ Login error:", authError)
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        console.log("✅ Login successful:", data.user.email)
        await new Promise((resolve) => setTimeout(resolve, 100))
        window.location.href = "/dashboard"
      } else {
        setError("Login failed - no session created")
        setLoading(false)
      }
    } catch (error: any) {
      console.error("💥 Unexpected error:", error)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Music className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Man Behind The Music account</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSupabaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">⚠️ Supabase Not Configured</p>
                  <p className="text-sm">You need to set up your environment variables first.</p>
                  <Link href="/setup" className="text-sm text-primary hover:underline block">
                    → Complete setup guide
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && isSupabaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                autoComplete="email"
                disabled={loading || !isSupabaseConfigured}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={loading || !isSupabaseConfigured}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || !isSupabaseConfigured}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className={`text-sm hover:underline ${!isSupabaseConfigured ? "text-muted-foreground pointer-events-none" : "text-primary"}`}
              >
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !isSupabaseConfigured}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className={`hover:underline ${!isSupabaseConfigured ? "text-muted-foreground pointer-events-none" : "text-primary"}`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
