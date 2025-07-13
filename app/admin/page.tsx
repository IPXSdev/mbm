"use client"

import { useEffect, useState } from "react"
import { getTracks, updateTrackStatus, checkSyncFinalizationStatus, getPendingSyncNotifications, getChatSession, createChatSession, sendSyncMessage, getSyncMessages, getCurrentUser, closeChatSession } from "@/lib/db"
import dynamic from "next/dynamic"

const ViewFinalizedSubmission = dynamic(() => import("@/components/view-finalized-submission"), { ssr: false })
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, RefreshCw, Star, CheckCircle, XCircle, Clock, AlertTriangle, MessageCircle, Send, X } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function AdminDashboard() {
  const [tracks, setTracks] = useState<any[]>([])
  const [filteredTracks, setFilteredTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [viewMode, setViewMode] = useState<"ranked" | "newest">("ranked")
  const [reviewingTrack, setReviewingTrack] = useState<string | null>(null)
  const [showFinalizedModal, setShowFinalizedModal] = useState(false)
  const [selectedTrackForFinalized, setSelectedTrackForFinalized] = useState<any>(null)
  const [syncStatusMap, setSyncStatusMap] = useState<Record<string, string>>({})
  const [pendingNotifications, setPendingNotifications] = useState<any[]>([])
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedTrackForChat, setSelectedTrackForChat] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const [reviewData, setReviewData] = useState<{
    rating: number
    status: string
    notes: string
  }>({
    rating: 0,
    status: "pending",
    notes: ""
  })

  const moods = [
    "Action/Fight",
    "Sad",
    "Break Up",
    "Afro Beats",
    "Dance",
    "Sex",
    "Vulnerable",
    "House",
    "Inspirational",
  ]

  const fetchTracks = async (sortMode?: "rating" | "newest") => {
    try {
      setLoading(true)
      setError("")
      console.log("Admin dashboard: Fetching tracks...")
      // Map viewMode to valid sortBy values
      const mappedSortBy = sortMode || (viewMode === "ranked" ? "rating" : "newest")
      const data = await getTracks(mappedSortBy)
      console.log("Admin dashboard: Tracks fetched successfully:", data)
      setTracks(data)
      applyMoodFilter(data, selectedMood)
      
      // Check sync status for approved tracks
      await checkSyncStatusForTracks(data)
      
      // Get pending notifications
      await fetchPendingNotifications()
    } catch (err: any) {
      console.error("Admin dashboard: Error fetching tracks:", err)
      setError("Failed to load submissions.")
    } finally {
      setLoading(false)
    }
  }

  const checkSyncStatusForTracks = async (trackData: any[]) => {
    const statusMap: Record<string, string> = {}
    const approvedTracks = trackData.filter(track => track.status === "approved")
    
    for (const track of approvedTracks) {
      try {
        const status = await checkSyncFinalizationStatus(track.id)
        statusMap[track.id] = status
      } catch (error) {
        console.error(`Error checking sync status for track ${track.id}:`, error)
        statusMap[track.id] = "not_started"
      }
    }
    
    setSyncStatusMap(statusMap)
  }

  const fetchPendingNotifications = async () => {
    try {
      const notifications = await getPendingSyncNotifications()
      setPendingNotifications(notifications)
    } catch (error) {
      console.error("Error fetching pending notifications:", error)
    }
  }

  const applyMoodFilter = (trackData: any[], mood: string) => {
    if (mood === "") {
      setFilteredTracks(trackData)
    } else {
      const filtered = trackData.filter(track => track.mood === mood)
      setFilteredTracks(filtered)
    }
  }

  const handleMoodFilter = (mood: string) => {
    setSelectedMood(mood)
    applyMoodFilter(tracks, mood)
  }

  const handleViewModeChange = (mode: "ranked" | "newest") => {
    setViewMode(mode)
    const sortBy = mode === "ranked" ? "rating" : "newest"
    fetchTracks(sortBy)
  }

  const handleReview = async (trackId: string) => {
    if (reviewingTrack === trackId) {
      // Save review
      try {
        await updateTrackStatus(
          trackId,
          reviewData.status as any,
          reviewData.rating || undefined,
          reviewData.notes || undefined,
          undefined, // Remove priority parameter
          "admin" // You might want to use actual admin user ID
        )
        
        // Refresh tracks after update
        await fetchTracks()
        setReviewingTrack(null)
        setReviewData({ rating: 0, status: "pending", notes: "" })
      } catch (error) {
        console.error("Failed to update track:", error)
        setError("Failed to update track status")
      }
    } else {
      // Start reviewing
      const track = tracks.find(t => t.id === trackId)
      if (track) {
        setReviewData({
          rating: track.rating || 0,
          status: track.status || "pending",
          notes: track.admin_notes || ""
        })
        setReviewingTrack(trackId)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-400" />
      case "rejected": return <XCircle className="h-4 w-4 text-red-400" /> // Legacy status
      case "under_review": return <Clock className="h-4 w-4 text-yellow-400" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-300"
      case "rejected": return "bg-red-500/20 text-red-300" // Legacy status
      case "under_review": return "bg-yellow-500/20 text-yellow-300"
      default: return "bg-gray-500/20 text-gray-300"
    }
  }

  const openChatModal = async (track: any) => {
    try {
      setSelectedTrackForChat(track)
      setShowChatModal(true)
      
      // Get current admin user via Supabase auth directly
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setError("Authentication required to access chat")
        return
      }
      
      setCurrentAdmin(user)
      
      // Get existing chat session (don't auto-create)
      const chatSession = await getChatSession(track.id)
      
      // Load existing messages if session exists
      const messages = await getSyncMessages(track.id)
      setChatMessages(messages)
    } catch (error) {
      console.error("Error opening chat:", error)
      setError("Failed to open chat")
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTrackForChat || !currentAdmin) return
    
    try {
      setSendingMessage(true)
      const message = await sendSyncMessage(
        selectedTrackForChat.id,
        currentAdmin.id,
        "admin",
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
    setCurrentAdmin(null)
  }

  // Chat session management functions
  const startChatSession = async () => {
    if (!selectedTrackForChat || !currentAdmin) return
    
    try {
      // Create new chat session with admin as initiator
      const chatSession = await createChatSession(
        selectedTrackForChat.id, 
        selectedTrackForChat.user_id, 
        currentAdmin.id
      )
      
      // Send first message if there's content
      if (newMessage.trim()) {
        await sendMessage()
      } else {
        // Send a default welcome message
        const welcomeMessage = await sendSyncMessage(
          selectedTrackForChat.id,
          currentAdmin.id,
          "admin",
          "Hello! I'm here to help with your track submission. How can I assist you today?"
        )
        setChatMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Error starting chat session:", error)
      setError("Failed to start chat session")
    }
  }

  const endChatSession = async () => {
    if (!selectedTrackForChat) return
    
    try {
      // Close the chat session in database
      await closeChatSession(selectedTrackForChat.id)
      
      // Send final message
      if (currentAdmin) {
        const finalMessage = await sendSyncMessage(
          selectedTrackForChat.id,
          currentAdmin.id,
          "admin",
          "This chat session has been closed. Thank you for your time!"
        )
        setChatMessages(prev => [...prev, finalMessage])
      }
      
      // Close modal after brief delay
      setTimeout(() => {
        closeChatModal()
      }, 2000)
    } catch (error) {
      console.error("Error closing chat session:", error)
      setError("Failed to close chat session")
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  useEffect(() => {
    applyMoodFilter(tracks, selectedMood)
  }, [tracks, selectedMood])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Music className="h-8 w-8 animate-pulse mx-auto mb-4" />
        <p className="text-white">Loading submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-red-500/20 border-red-500/50">
        <AlertDescription className="text-white">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notifications Section */}
      {pendingNotifications.length > 0 && (
        <Alert className="bg-blue-500/20 border-blue-500/50 mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-white">
            <strong>{pendingNotifications.length} New Sync Finalization{pendingNotifications.length !== 1 ? 's' : ''}</strong>
            <div className="mt-2 space-y-1">
              {pendingNotifications.slice(0, 3).map(notification => (
                <div key={notification.trackId} className="text-sm">
                  • "{notification.trackTitle}" by {notification.artistName}
                </div>
              ))}
              {pendingNotifications.length > 3 && (
                <div className="text-sm text-blue-200">
                  + {pendingNotifications.length - 3} more...
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Uploads</h1>
          <p className="text-gray-400 text-sm mt-1">
            {viewMode === "ranked" 
              ? "Submissions are ranked by star rating (highest first)" 
              : "Submissions are ordered by newest first"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">View:</span>
            <div className="flex rounded-lg bg-white/10 p-1">
              <button
                onClick={() => handleViewModeChange("ranked")}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  viewMode === "ranked"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                ⭐ Ranked
              </button>
              <button
                onClick={() => handleViewModeChange("newest")}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  viewMode === "newest"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                🕒 Newest
              </button>
            </div>
          </div>
          <Button onClick={() => fetchTracks()} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Mood Filter Section */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Filter by Mood</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleMoodFilter("")}
            className={`px-3 py-2 rounded-full text-sm transition-all ${
              selectedMood === ""
                ? "bg-blue-600 text-white border-2 border-blue-400"
                : "bg-white/10 text-gray-300 border-2 border-white/20 hover:bg-white/20 hover:border-white/30"
            }`}
          >
            All Moods ({tracks.length})
          </button>
          {moods.map((mood) => {
            const count = tracks.filter(track => track.mood === mood).length
            return (
              <button
                key={mood}
                onClick={() => handleMoodFilter(mood)}
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  selectedMood === mood
                    ? "bg-blue-600 text-white border-2 border-blue-400"
                    : "bg-white/10 text-gray-300 border-2 border-white/20 hover:bg-white/20 hover:border-white/30"
                }`}
              >
                {mood} ({count})
              </button>
            )
          })}
        </div>
      </div>
      {filteredTracks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">
            {selectedMood ? `No submissions found for "${selectedMood}" mood.` : "No submissions yet."}
          </p>
          <p className="text-gray-400 text-sm">Check the browser console for debugging info.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTracks.map((track) => (
            <Card key={track.id} className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{track.title}</CardTitle>
                    <p className="text-gray-300">by {track.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(track.status)}>
                      {getStatusIcon(track.status)}
                      {track.status === "under_review" ? "under consideration" : track.status}
                    </Badge>
                    {track.rating && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= track.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                        <span className="text-white text-sm ml-1">{track.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-300">Genre: {track.genre}</p>
                  <p className="text-gray-300">Email: {track.email}</p>
                  <p className="text-gray-400">Submitted: {new Date(track.created_at).toLocaleString()}</p>
                  {track.reviewed_at && (
                    <p className="text-gray-400">Reviewed: {new Date(track.reviewed_at).toLocaleString()}</p>
                  )}
                </div>

                {track.mood && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Track Mood:</p>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {track.mood}
                    </Badge>
                  </div>
                )}

                {track.file_url && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Audio:</p>
                    <audio controls src={track.file_url} className="w-full" />
                  </div>
                )}

                {track.image_url && (
                  <img src={track.image_url} alt="Cover" className="w-24 h-24 object-cover rounded" />
                )}

                {track.admin_notes && reviewingTrack !== track.id && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Admin Notes:</p>
                    <p className="text-gray-300 text-sm bg-white/5 p-2 rounded">{track.admin_notes}</p>
                  </div>
                )}

                {reviewingTrack === track.id && (
                  <div className="space-y-4 border-t border-white/20 pt-4">
                    <h3 className="text-white font-semibold">Review Track</h3>
                    
                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">Status</label>
                      <Select value={reviewData.status} onValueChange={(value) => setReviewData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="under_review">Under Consideration</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`h-6 w-6 ${
                                star <= reviewData.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-400'
                              }`}
                            />
                          </button>
                        ))}
                        {reviewData.rating > 0 && (
                          <span className="text-gray-300 text-sm ml-2">
                            {reviewData.rating} star{reviewData.rating !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">Admin Notes</label>
                      <Textarea
                        value={reviewData.notes}
                        onChange={(e) => setReviewData(prev => ({ ...prev, notes: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Add notes about this submission..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReview(track.id)}
                      variant={reviewingTrack === track.id ? "default" : "outline"}
                      className={reviewingTrack === track.id ? 
                        "bg-green-600 hover:bg-green-700 text-white" : 
                        "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }
                    >
                      {reviewingTrack === track.id ? "Save Review" : "Review"}
                    </Button>
                    
                    {track.status === "approved" && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setSelectedTrackForFinalized(track)
                            setShowFinalizedModal(true)
                          }}
                          variant="outline"
                          disabled={syncStatusMap[track.id] === "not_started"}
                          className={`${
                            syncStatusMap[track.id] === "completed" 
                              ? "bg-green-600/20 border-green-400/40 text-green-300 hover:bg-green-600/30"
                              : syncStatusMap[track.id] === "requires_updates"
                              ? "bg-yellow-600/20 border-yellow-400/40 text-yellow-300 hover:bg-yellow-600/30"
                              : "bg-gray-600/20 border-gray-400/40 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {syncStatusMap[track.id] === "completed" && "📋 View Sync Details"}
                          {syncStatusMap[track.id] === "requires_updates" && "⚠️ Sync Updates Required"}
                          {syncStatusMap[track.id] === "not_started" && "⏳ Awaiting Sync Details"}
                        </Button>
                        
                        {/* Status Indicator */}
                        {syncStatusMap[track.id] === "completed" && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/40">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Finalized
                          </Badge>
                        )}
                        {syncStatusMap[track.id] === "requires_updates" && (
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-400/40">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Needs Update
                          </Badge>
                        )}
                        {syncStatusMap[track.id] === "not_started" && (
                          <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-400/40">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        
                        {/* Chat Button - Only show for approved tracks */}
                        <Button
                          onClick={() => openChatModal(track)}
                          variant="outline"
                          size="sm"
                          className="bg-purple-600/20 border-purple-400/40 text-purple-300 hover:bg-purple-600/30"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {reviewingTrack === track.id && (
                    <Button
                      onClick={() => setReviewingTrack(null)}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* View Finalized Submission Modal */}
      {showFinalizedModal && selectedTrackForFinalized && (
        <ViewFinalizedSubmission
          track={selectedTrackForFinalized}
          onClose={() => {
            setShowFinalizedModal(false)
            setSelectedTrackForFinalized(null)
          }}
        />
      )}
      
      {/* Chat Modal */}
      {showChatModal && selectedTrackForChat && (
        <Dialog open={showChatModal} onOpenChange={closeChatModal}>
          <DialogContent className="max-w-2xl p-6 mx-auto bg-gray-800 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center justify-between">
                <span>Chat for "{selectedTrackForChat.title}" by {selectedTrackForChat.artist}</span>
                <div className="flex gap-2">
                  {chatMessages.length === 0 ? (
                    <Button
                      onClick={startChatSession}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Start Chat
                    </Button>
                  ) : (
                    <Button
                      onClick={endChatSession}
                      size="sm"
                      variant="outline"
                      className="border-red-400 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      End Chat
                    </Button>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {chatMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-white">No Chat Session Active</h3>
                <p className="text-gray-400 mb-4">
                  Click "Start Chat" to begin a conversation with the user about this track.
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="h-80 mb-4">
                  <div className="space-y-4 p-2">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                          message.sender_role === "admin" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 text-gray-300"
                        }`}>
                          <p className="mb-1">{message.message}</p>
                          <p className="text-xs opacity-70">
                            {message.sender_role === "admin" ? "Admin" : "User"} • {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Type your message..."
                    disabled={sendingMessage}
                  />
                  <Button
                    onClick={sendMessage}
                    className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    {sendingMessage ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
