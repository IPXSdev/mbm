"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          // If no profile exists, create one with user role
          const { error: createError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email!,
            role: "user",
          })

          if (createError) throw createError

          setError("Access denied. This account does not have admin privileges.")
          await supabase.auth.signOut()
          return
        }

        if (profile.role !== "admin" && profile.role !== "master_admin") {
          setError("Access denied. This account does not have admin privileges.")
          await supabase.auth.signOut()
          return
        }

        // Redirect to admin dashboard
        router.push("/admin")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Check if this is the master admin email
        const isMasterAdmin = email === process.env.NEXT_PUBLIC_MASTER_ADMIN_EMAIL

        // Create profile with appropriate role
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          role: isMasterAdmin ? "master_admin" : "user",
        })

        if (profileError) throw profileError

        if (isMasterAdmin) {
          router.push("/admin")
        } else {
          setError("Account created successfully, but admin access must be granted by a master admin.")
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-white hover:text-yellow-400 transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-400 p-3 rounded-full">
              <Shield className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">Enter your admin credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-900 border-red-700">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                <Button
                  type="button"
                  onClick={handleSignUp}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">Need help? Contact the system administrator</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
