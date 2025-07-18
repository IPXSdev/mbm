"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/admin-login")
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error || !profile || (profile.role !== "admin" && profile.role !== "master_admin")) {
        router.replace("/admin-login")
        return
      }

      if (mounted) {
        setIsAdmin(true)
        setLoading(false)
      }
    }

    checkAdmin()

    return () => {
      mounted = false
    }
  }, [router])

  if (loading) {
    return <div className="text-center text-white p-8">Checking admin access...</div>
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}