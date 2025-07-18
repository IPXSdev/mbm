"use client"


import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-client"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        setUser(user)

        // Fetch profile to check role
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
        // Allow if admin, master_admin, or specific email
        if (
          profile?.role === "admin" ||
          profile?.role === "master_admin" ||
          user.email?.toLowerCase() === "2668harris@gmail.com"
        ) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-lg text-gray-400">
        You are not authorized to access the admin portal.<br />
        <a href="/" className="text-yellow-400 underline">Go to Home</a>
      </div>
    )
  }

  return <>{children}</>
}
