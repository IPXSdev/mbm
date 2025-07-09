"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Upload, User, LogOut } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking user session...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("Session check result:", { session: !!session, error })

        if (error) {
          console.error("Session error:", error)
          setLoading(false)
          return
        }

        if (session?.user) {
          console.log("User found:", session.user.email)
          setUser(session.user)
        } else {
          console.log("No user session found")
        }
      } catch (error) {
        console.error("Auth error:", error)
      }
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        setLoading(false)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      console.log("Signing out...")
      await supabase.auth.signOut()
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Please Sign In</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">You need to be signed in to access your dashboard.</p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">{user?.user_metadata?.name || user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/submit">
              <Upload className="mr-2 h-4 w-4" />
              Submit Music
            </Link>
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Your Music
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Submit your tracks to get them reviewed by industry A&Rs and considered for placement opportunities.
            </p>
            <Button asChild>
              <Link href="/submit">Submit New Track</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your account is active. Explore our platform to discover placement opportunities.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
