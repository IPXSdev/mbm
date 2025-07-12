"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Music,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Star,
  AlertTriangle,
  Mail,
  Calendar,
  Tag,
  FileAudio,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-client"

// Mock data for demo
type TrackStatus = "pending" | "under_review" | "approved" | "rejected"
type Track = {
  id: string
  title: string
  artist: string
  genre: string
  email: string
  status: TrackStatus
  created_at: string
  file_size: number
  admin_notes: string
  rating: number
  priority: "low" | "medium" | "high"
}

const mockTracks: Track[] = [
  {
    id: "1",
    title: "Sample Track 1",
    artist: "Demo Artist 1",
    genre: "Hip Hop",
    email: "artist1@example.com",
    status: "pending",
    created_at: new Date().toISOString(),
    file_size: 5242880,
    admin_notes: "",
    rating: 0,
    priority: "medium",
  },
  {
    id: "2",
    title: "Sample Track 2",
    artist: "Demo Artist 2",
    genre: "R&B",
    email: "artist2@example.com",
    status: "approved",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    file_size: 7340032,
    admin_notes: "Great track!",
    rating: 5,
    priority: "high",
  },
]


export default function AdminDashboard() {
  // Assume user is authenticated (handled by layout)
  const [tracks, setTracks] = useState<Track[]>(mockTracks)
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(mockTracks)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [bulkNotes, setBulkNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    let filtered = tracks
    if (searchTerm) {
      filtered = filtered.filter(
        (track) =>
          track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((track) => track.status === statusFilter)
    }
    if (genreFilter !== "all") {
      filtered = filtered.filter((track) => track.genre === genreFilter)
    }
    setFilteredTracks(filtered)
  }, [tracks, searchTerm, statusFilter, genreFilter])

  const handleStatusUpdate = async (trackId: string, newStatus: Track["status"]) => {
    try {
      setIsUpdating(true)
      // Mock update for demo
      setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, status: newStatus } : track)))
    } catch (err) {
      console.error("Error updating status:", err)
      setError("Failed to update track status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedTracks.length === 0) return

    try {
      setIsUpdating(true)
      // Mock bulk update for demo
      setTracks((prev) =>
        prev.map((track) =>
          selectedTracks.includes(track.id)
            ? { ...track, status: bulkAction as Track["status"], admin_notes: bulkNotes || track.admin_notes }
            : track,
        ),
      )
      setSelectedTracks([])
      setBulkAction("")
      setBulkNotes("")
    } catch (err) {
      console.error("Error with bulk action:", err)
      setError("Failed to perform bulk action")
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks((prev) => (prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]))
  }

  const selectAllTracks = () => {
    if (selectedTracks.length === filteredTracks.length) {
      setSelectedTracks([])
    } else {
      setSelectedTracks(filteredTracks.map((track) => track.id))
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: "bg-gray-500", text: "Low" },
      medium: { color: "bg-blue-500", text: "Medium" },
      high: { color: "bg-red-500", text: "High" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

    return <Badge className={`${config.color} text-white text-xs`}>{config.text}</Badge>
  }

  const stats = {
    total: tracks.length,
    pending: tracks.filter((t) => t.status === "pending").length,
    approved: tracks.filter((t) => t.status === "approved").length,
    rejected: tracks.filter((t) => t.status === "rejected").length,
  }

  const uniqueGenres = [...new Set(tracks.map((track) => track.genre))].sort()



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage music submissions and track reviews</p>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Submissions</CardTitle>
              <Music className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tracks, artists, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {uniqueGenres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setGenreFilter("all")
                }}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTracks.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Bulk Actions ({selectedTracks.length} selected)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                    <SelectItem value="under_review">Mark Under Review</SelectItem>
                    <SelectItem value="pending">Mark Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Add notes (optional)"
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <Button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdating ? "Processing..." : "Apply Action"}
                </Button>

                <Button
                  onClick={() => setSelectedTracks([])}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submissions Table */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Music Submissions</CardTitle>
                <CardDescription className="text-gray-300">
                  Showing {filteredTracks.length} of {tracks.length} submissions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedTracks.length === filteredTracks.length && filteredTracks.length > 0}
                  onCheckedChange={selectAllTracks}
                />
                <span className="text-white text-sm">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTracks.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white">No submissions found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <Checkbox
                      checked={selectedTracks.includes(track.id)}
                      onCheckedChange={() => toggleTrackSelection(track.id)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium truncate">{track.title}</h3>
                          <p className="text-gray-300 text-sm">by {track.artist}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(track.priority)}
                          {getStatusBadge(track.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-white">{track.genre}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white truncate">{track.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">Submitted:</span>
                          <span className="text-white">{new Date(track.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileAudio className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">Size:</span>
                          <span className="text-white">
                            {track.file_size ? `${(track.file_size / 1024 / 1024).toFixed(1)}MB` : "N/A"}
                          </span>
                        </div>
                      </div>

                      {track.rating > 0 && (
                        <div className="flex items-center mt-2">
                          <span className="text-gray-400 text-sm mr-2">Rating:</span>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < track.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {track.admin_notes && (
                        <div className="mt-2">
                          <span className="text-gray-400 text-sm">Notes:</span>
                          <p className="text-white text-sm mt-1">{track.admin_notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Link href={`/admin/submissions?id=${track.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Link>
                      </Button>

                      <Select
                        value={track.status}
                        onValueChange={(value) => handleStatusUpdate(track.id, value as Track["status"])}
                      >
                        <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
