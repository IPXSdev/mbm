"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          setError("You must be logged in as an admin to view this page")
          setLoading(false)
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (profileError || profile?.role !== "admin") {
          setError("Access denied. Admins only.")
          setLoading(false)
          return
        }

        const { data, error: submissionsError } = await supabase
          .from("submissions")
          .select("*")
          .order("created_at", { ascending: false })

        if (submissionsError) {
          throw submissionsError
        }

        setSubmissions(data || [])
      } catch (err: any) {
        console.error("Fetch error:", err)
        setError("Failed to fetch submissions")
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Admin Submissions</CardTitle>
            <CardDescription className="text-gray-300">
              Review all user-submitted tracks below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin h-8 w-8 text-white" />
              </div>
            ) : error ? (
              <Alert className="bg-red-500/10 border-red-500/40">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : submissions.length === 0 ? (
              <p className="text-gray-400 text-center">No submissions found.</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 border border-white/20 rounded bg-white/5"
                  >
                    <p><strong>Title:</strong> {submission.title}</p>
                    <p><strong>Artist:</strong> {submission.artist}</p>
                    <p><strong>Email:</strong> {submission.email}</p>
                    <p><strong>Genre:</strong> {submission.genre}</p>
                    <p><strong>Description:</strong> {submission.description}</p>
                    <p><strong>Status:</strong> {submission.status}</p>
                    <p><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleString()}</p>
                    {submission.file_url && (
                      <audio controls src={submission.file_url} className="mt-2 w-full" />
                    )}
                    {submission.image_url && (
                      <img
                        src={submission.image_url}
                        alt="Cover"
                        className="mt-2 h-32 w-32 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
