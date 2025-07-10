"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Download, ArrowLeft, Star, Clock, CheckCircle, XCircle, Eye, User, Mail, Calendar, Music, Tag, FileAudio, AlertTriangle } from 'lucide-react'

// Mock data for demo purposes
const mockTrack = {
  id: "1",
  title: "Sample Track",
  artist: "Demo Artist",
  genre: "Hip Hop",
  email: "artist@example.com",
  status: "pending" as const,
  created_at: new Date().toISOString(),
  file_url: "/placeholder-audio.mp3",
  image_url: "/placeholder.svg?height=256&width=256",
  description: "This is a demo track for testing purposes.",
  file_size: 5242880, // 5MB
  file_name: "demo-track.mp3",
  admin_notes: "",
  rating: 0,
  priority: "medium" as const,
  reviewed_by: null,
  reviewed_at: null,
}

type Track = typeof mockTrack

export default function SubmissionDetailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const trackId = searchParams.get("id")
  const audioRef = useRef<HTMLAudioElement>(null)

  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Review form state
  const [newStatus, setNewStatus] = useState<Track["status"]>("pending")
  const [adminNotes, setAdminNotes] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  useEffect(() => {
    // Load mock data for demo
    setTrack(mockTrack)
    setNewStatus(mockTrack.status)
    setAdminNotes(mockTrack.admin_notes || "")
    setRating(mockTrack.rating || 0)
    setPriority(mockTrack.priority || "medium")
    setLoading(false)
  }, [trackId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [track])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0] / 100
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const skipTime = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleStatusUpdate = async () => {
    if (!track) return

    try {
      setIsUpdating(true)
      // Mock update for demo
      console.log("Updating track status:", { newStatus, adminNotes, rating, priority })
      // In real app, this would call an API
      setTrack({ ...track, status: newStatus, admin_notes: adminNotes, rating, priority })
    } catch (err) {
      console.error("Error updating track:", err)
      setError("Failed to update track")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending", icon: Clock },
      under_review: { color: "bg-blue-500", text: "Under Review", icon: Eye },
      approved: { color: "bg-green-500", text: "Approved", icon: CheckCircle },
      rejected: { color: "bg-red-500", text: "Rejected", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Music className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading track details...</p>
        </div>
      </div>
    )
  }

  if (error || !track) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-300 mb-4">{error || "Track not found"}</p>
            <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{track.title}</h1>
              <p className="text-gray-300">by {track.artist}</p>
            </div>
          </div>
          {getStatusBadge(track.status)}
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileAudio className="h-5 w-5" />
                  Audio Player
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio ref={audioRef} src={track.file_url} preload="metadata" />

                {/* Cover Image */}
                {track.image_url && (
                  <div className="flex justify-center">
                    <img
                      src={track.image_url || "/placeholder.svg"}
                      alt={`${track.title} cover`}
                      className="w-64 h-64 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[duration ? (currentTime / duration) * 100 : 0]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => skipTime(-10)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={togglePlayPause}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => skipTime(10)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/10">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1 max-w-32"
                  />
                </div>

                {/* Download Button */}
                <div className="flex justify-center">
                  <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                    <a href={track.file_url} download={track.file_name || `${track.title}.mp3`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Track
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Track Details */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Track Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Artist:</span>
                    <span className="text-white">{track.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Genre:</span>
                    <span className="text-white">{track.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{track.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Submitted:</span>
                    <span className="text-white">{new Date(track.created_at).toLocaleDateString()}</span>
                  </div>
                  {track.file_size && (
                    <div className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">File Size:</span>
                      <span className="text-white">{(track.file_size / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                  )}
                  {track.file_name && (
                    <div className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">File Name:</span>
                      <span className="text-white">{track.file_name}</span>
                    </div>
                  )}
                </div>

                {track.description && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Description</h4>
                    <p className="text-gray-300">{track.description}</p>
                  </div>
                )}

                {track.rating && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Current Rating</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < track.rating! ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                        />
                      ))}
                      <span className="text-white ml-2">{track.rating}/5</span>
                    </div>
                  </div>
                )}

                {track.admin_notes && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Previous Notes</h4>
                    <p className="text-gray-300 bg-white/5 p-3 rounded-lg">{track.admin_notes}</p>
                  </div>
                )}

                {track.reviewed_by && track.reviewed_at && (
                  <div className="text-sm text-gray-400">
                    Last reviewed by {track.reviewed_by} on {new Date(track.reviewed_at).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Review Track</CardTitle>
                <CardDescription className="text-gray-300">Update status and add review notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Status</label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Track["status"])}>
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

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Priority</label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
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

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Rating</label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button key={i} type="button" onClick={() => setRating(i + 1)} className="focus:outline-none">
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            i < rating ? "text-yellow-400 fill-current" : "text-gray-600 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <button
                        type="button"
                        onClick={() => setRating(0)}
                        className="ml-2 text-sm text-gray-400 hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add review notes..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdating ? "Updating..." : "Update Review"}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => {
                    setNewStatus("approved")
                    setRating(5)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Quick Approve
                </Button>
                <Button
                  onClick={() => {
                    setNewStatus("rejected")
                    setRating(1)
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Quick Reject
                </Button>
                <Button
                  onClick={() => setNewStatus("under_review")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Mark Under Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}