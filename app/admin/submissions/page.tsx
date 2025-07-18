"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchSubmissions = async () => {
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

        // Fetch submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select("*")
          .order("created_at", { ascending: false })

        if (submissionsError) throw submissionsError
        setSubmissions(submissionsData || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [router])

  if (loading) {
    return <div className="text-center text-white p-8">Loading submissions...</div>
  }

  if (error) {
    return <div className="text-center text-red-400 p-8">{error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Submissions</h1>
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-gray-400">No submissions found.</div>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="bg-gray-800 p-4 rounded shadow text-white">
              <div className="font-semibold">{submission.title}</div>
              <div className="text-sm text-gray-400">{submission.artist}</div>
              <div className="text-xs text-gray-500">{submission.created_at}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}