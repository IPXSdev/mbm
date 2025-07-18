"use client"
import dynamic from "next/dynamic"
const GrantAdminForm = dynamic(() => import("../admin-portal/users/grant-admin"), { ssr: false })
const FinalizeSubmissionForm = dynamic(() => import("@/components/finalize-submission-form"), { ssr: false })

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Music, Upload, User, CheckCircle, Clock, XCircle, MessageCircle, Send, RefreshCw } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { getCurrentUser, getChatSession, createChatSession, sendSyncMessage, getSyncMessages } from "@/lib/db"
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
  const [showFinalizeModal, setShowFinalizeModal] = useState(false)
  const [selectedTrackForFinalize, setSelectedTrackForFinalize] = useState<SubmittedTrack | null>(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedTrackForChat, setSelectedTrackForChat] = useState<SubmittedTrack | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [chatSessionsStatus, setChatSessionsStatus] = useState<Record<string, string>>({})
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
      const tracks = submissions || []
      setSubmittedTracks(tracks)
      
      // Check chat session status for all tracks
      await checkChatSessionsStatus(tracks)
    } catch (error) {
      console.error("Error loading submissions:", error)
      setSubmittedTracks([])
    } finally {
      setLoadingTracks(false)
    }
  }

  // Check chat session status for all user tracks
  const checkChatSessionsStatus = async (tracks: SubmittedTrack[]) => {
    const statusMap: Record<string, string> = {}
    
    for (const track of tracks) {
      try {
        const session = await getChatSession(track.id)
        statusMap[track.id] = session ? session.status : "no_session"
      } catch (error) {
        console.error(`Error checking chat status for track ${track.id}:`, error)
        statusMap[track.id] = "no_session"
      }
    }
    
    setChatSessionsStatus(statusMap)
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

  // Chat functionality
  const openChatModal = async (track: SubmittedTrack) => {
    try {
      // Check if there's an active chat session
      const chatSession = await getChatSession(track.id)
      if (!chatSession || chatSession.status !== 'open') {
        setError("No active chat session found. Admin has not initiated chat for this track.")
        return
      }
      
      setSelectedTrackForChat(track)
      setShowChatModal(true)
      
      // Load existing messages
      const messages = await getSyncMessages(track.id)
      setChatMessages(messages)
    } catch (error) {
      console.error("Error opening chat:", error)
      setError("Failed to open chat")
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTrackForChat || !user) return
    
    try {
      setSendingMessage(true)
      const message = await sendSyncMessage(
        selectedTrackForChat.id,
        user.id,
        "user",
        newMessage.trim()
      )
      
      setChatMessages(prev => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message")
    } finally {
      setSendingMessage(false)
    }
  }

  const closeChatModal = () => {
    setShowChatModal(false)
    setSelectedTrackForChat(null)
    setChatMessages([])
    setNewMessage("")
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
      {/* ...existing code... */}
    </div>
  )
}