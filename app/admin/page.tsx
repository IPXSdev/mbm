
"use client"

import { useEffect, useState } from "react"
import { getTracks, updateTrackStatus } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Music, RefreshCw, Star, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const [tracks, setTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reviewingTrack, setReviewingTrack] = useState<string | null>(null)
  const [reviewData, setReviewData] = useState<{
    rating: number
    status: string
    priority: string
    notes: string
  }>({
    rating: 0,
    status: "pending",
    priority: "medium",
    notes: ""
  })

  const fetchTracks = async () => {
    try {
      setLoading(true)
      setError("")
      console.log("Admin dashboard: Fetching tracks...")
      const data = await getTracks()
      console.log("Admin dashboard: Tracks fetched successfully:", data)
      setTracks(data)
    } catch (err: any) {
      console.error("Admin dashboard: Error fetching tracks:", err)
      setError("Failed to load submissions.")
    } finally {
      setLoading(false)
    }
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
          reviewData.priority as any,
          "admin" // You might want to use actual admin user ID
        )
        
        // Refresh tracks after update
        await fetchTracks()
        setReviewingTrack(null)
        setReviewData({ rating: 0, status: "pending", priority: "medium", notes: "" })
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
          priority: track.priority || "medium",
          notes: track.admin_notes || ""
        })
        setReviewingTrack(trackId)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-400" />
      case "rejected": return <XCircle className="h-4 w-4 text-red-400" />
      case "under_review": return <Clock className="h-4 w-4 text-yellow-400" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-300"
      case "rejected": return "bg-red-500/20 text-red-300"
      case "under_review": return "bg-yellow-500/20 text-yellow-300"
      default: return "bg-gray-500/20 text-gray-300"
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [])

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Platform Uploads</h1>
        <Button onClick={fetchTracks} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      {tracks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">No submissions yet.</p>
          <p className="text-gray-400 text-sm">Check the browser console for debugging info.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tracks.map((track) => (
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
                      {track.status}
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

                {track.description && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Description:</p>
                    <p className="text-gray-300 text-sm">{track.description}</p>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm mb-1 block">Status</label>
                        <Select value={reviewData.status} onValueChange={(value) => setReviewData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-gray-300 text-sm mb-1 block">Priority</label>
                        <Select value={reviewData.priority} onValueChange={(value) => setReviewData(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
    </div>
  )
}
