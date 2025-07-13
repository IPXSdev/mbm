
"use client"
import dynamic from "next/dynamic"
const GrantAdminForm = dynamic(() => import("../admin-portal/users/grant-admin"), { ssr: false })

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Music, Upload, User, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { getCurrentUser } from "@/lib/db"
import { useRouter } from "next/navigation"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

interface SubmittedTrack {
  id: string
  title: string
  artist: string
  genre: string
  status: "pending" | "approved" | "rejected" | "under_review"
  created_at: string
  image_url?: string
  file_url?: string
  description?: string
  admin_notes?: string
  email?: string
  file_count?: number
  image_count?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submittedTracks, setSubmittedTracks] = useState<SubmittedTrack[]>([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMasterAdmin, setIsMasterAdmin] = useState(false)
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [adminPrivilegeMode, setAdminPrivilegeMode] = useState<"grant" | "revoke">("grant")
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        console.log("Dashboard: Checking user session...")

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("Dashboard: Session check result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: sessionError,
        })

        if (sessionError) {
          console.error("Dashboard: Session error:", sessionError)
          if (mounted) {
            setError("Session error: " + sessionError.message)
            setLoading(false)
          }
          return
        }

        if (session?.user && mounted) {
          console.log("Dashboard: User found:", session.user.email)
          setUser(session.user)
          setError(null)
          // Check admin role
          getCurrentUser().then((currentUser) => {
            const role = currentUser?.role
            setIsAdmin(role === "admin" || role === "master_admin" || (session.user.email?.toLowerCase() === "2668harris@gmail.com"));
            setIsMasterAdmin(role === "master_admin" || (session.user.email?.toLowerCase() === "2668harris@gmail.com"));
          })
          // Load user's actual submissions
          await loadUserSubmissions(session.user.id)
        } else if (mounted) {
          console.log("Dashboard: No user session found")
          setError("No active session found")
        }
      } catch (error) {
        console.error("Dashboard: Auth error:", error)
        if (mounted) {
          setError("Authentication error: " + (error as Error).message)
        }
      }

      if (mounted) {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes with proper TypeScript typing
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Dashboard: Auth state changed:", event, session?.user?.email)

      if (!mounted) return

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        setError(null)
        setLoading(false)
        getCurrentUser().then((currentUser) => {
          const role = currentUser?.role
          setIsAdmin(role === "admin" || role === "master_admin" || (session.user.email?.toLowerCase() === "2668harris@gmail.com"));
          setIsMasterAdmin(role === "master_admin" || (session.user.email?.toLowerCase() === "2668harris@gmail.com"));
        })
        await loadUserSubmissions(session.user.id)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setSubmittedTracks([])
        setError("User signed out")
        setLoading(false)
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user)
        setError(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const loadUserSubmissions = async (userId: string) => {
    try {
      setLoadingTracks(true)
      console.log("Loading submissions for user:", userId)

      // Load submissions from database instead of localStorage
      const { data: submissions, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading submissions from database:", error)
        setSubmittedTracks([])
        return
      }

      console.log("Found tracks in database:", submissions)
      setSubmittedTracks(submissions || [])
    } catch (error) {
      console.error("Error loading submissions:", error)
      setSubmittedTracks([])
    } finally {
      setLoadingTracks(false)
    }
  }



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "under_review":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "Congratulations! Your track has been approved and is being considered for placements."
      case "rejected":
        return "This submission wasn't selected this time. Check the feedback below and feel free to submit again."
      case "under_review":
        return "Your track is under consideration by our A&R team. We'll notify you once we've made a decision."
      default:
        return "Your track is currently under review. We'll notify you once we've made a decision."
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          <p className="mt-1 text-xs text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <CardTitle className="text-red-600">Authentication Issue</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In Again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show sign-in prompt if no user
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

  // Show dashboard content
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
          </p>
          <p className="text-xs text-muted-foreground mt-1">User ID: {user?.id?.slice(0, 8)}...</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="default" asChild>
              <Link href="/admin-portal">
                Admin Portal
              </Link>
            </Button>
          )}
          {isMasterAdmin && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Admin Privileges</h3>
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setAdminPrivilegeMode("grant")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      adminPrivilegeMode === "grant"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    🔓 Grant Access
                  </button>
                  <button
                    onClick={() => setAdminPrivilegeMode("revoke")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      adminPrivilegeMode === "revoke"
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    🔒 Revoke Access
                  </button>
                </div>
                <Button variant="outline" onClick={() => setShowGrantModal(true)}>
                  {adminPrivilegeMode === "grant" ? "Grant Admin Access" : "Revoke Admin Access"}
                </Button>
              </div>
            </div>
          )}
          {submittedTracks.length > 0 && (
            <Button variant="outline" asChild>
              <Link href="/submit">
                <Upload className="mr-2 h-4 w-4" />
                Submit Music
              </Link>
            </Button>
          )}
        </div>

        {/* Admin Privileges Modal */}
        {showGrantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400" onClick={() => setShowGrantModal(false)}>&times;</button>
              <GrantAdminForm mode={adminPrivilegeMode} />
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Account Status:</strong> Active
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Submissions:</strong> {submittedTracks.length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submission Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Review</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {submittedTracks.filter((t) => t.status === "pending").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Approved</span>
                  <Badge className="bg-green-100 text-green-800">
                    {submittedTracks.filter((t) => t.status === "approved").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Under Consideration</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {submittedTracks.filter((t) => t.status === "under_review").length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Your Music Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTracks ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading your submissions...</p>
                </div>
              ) : submittedTracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Ready to make your first submission? Share your music with our A&R team and get discovered!
                  </p>
                  <Button asChild>
                    <Link href="/submit">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Your First Track
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {submittedTracks.map((track) => (
                    <div key={track.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        {track.image_url ? (
                          <img
                            src={track.image_url || "/placeholder.svg"}
                            alt={track.title}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <Music className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{track.title}</h3>
                              <p className="text-muted-foreground">{track.artist}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {track.genre}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Submitted {new Date(track.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(track.status)}
                              <Badge className={`${getStatusColor(track.status)}`}>
                                {track.status === "under_review" 
                                  ? "Under Consideration" 
                                  : track.status.charAt(0).toUpperCase() + track.status.slice(1)
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {track.description && (
                        <div>
                          <p className="text-sm text-muted-foreground">{track.description}</p>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-3">
                        <p className="text-sm">{getStatusMessage(track.status)}</p>

                        {track.admin_notes && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm font-medium mb-1">Feedback from our team:</p>
                            <p className="text-sm text-muted-foreground">{track.admin_notes}</p>
                          </div>
                        )}

                        {track.status === "approved" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-800">
                              🎉 <strong>Great news!</strong> Your track is now in our active catalog and being pitched
                              for placement opportunities.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
