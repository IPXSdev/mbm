"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Upload } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/auth-client"

export default function SimpleDashboard() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        window.location.href = "/auth/simple-login"
      }
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Redirecting to login...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">{user?.user_metadata?.name || user?.email}</p>
        </div>
        <Button asChild>
          <Link href="/submit" className="text-white hover:text-yellow-400">
            <Upload className="mr-2 h-4 w-4" />
            Submit Music
          </Link>
        </Button>
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
              Your account is active. Explore our platform to discover placement opportunities and connect with industry
              professionals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
