"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/auth-client"

export default function SimpleLoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            email: data.user.email!,
            name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email?.split("@")[0] ||
              "User",
            role: "user",
            updated_at: new Date().toISOString(),
          })

          if (profileError) {
            console.error("Profile creation error:", profileError)
          }
        }
        setMessage("Login successful! Redirecting...")
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1000)
      }
    } catch (err: any) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your Man Behind The Music account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="/auth/simple-signup" className="text-sm text-primary hover:underline">
              Need an account? Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
