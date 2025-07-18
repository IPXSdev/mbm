"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError("")
      try {
        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace("/admin-login")
          return
        }
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
        if (profileError || !profile || (profile.role !== "admin" && profile.role !== "master_admin")) {
          router.replace("/admin-login")
          return
        }

        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })

        if (usersError) throw usersError
        setUsers(usersData || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  if (loading) {
    return <div className="text-center text-white p-8">Loading users...</div>
  }

  if (error) {
    return <div className="text-center text-red-400 p-8">{error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="text-gray-400">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-gray-800 p-4 rounded shadow text-white">
              <div className="font-semibold">{user.full_name || user.email}</div>
              <div className="text-sm text-gray-400">{user.role}</div>
              <div className="text-xs text-gray-500">{user.created_at}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}