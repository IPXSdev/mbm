import { requireAdmin } from "@/lib/auth"
import { getTracks, getStats } from "@/lib/data"
import { updateTrackStatus } from "@/lib/actions/submissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AudioPlayer } from "@/components/audio-player"
import { Search, Check, X, Clock, Eye } from "lucide-react"

export default async function AdminSubmissionsPage() {
  await requireAdmin()

  const [allTracks, stats] = await Promise.all([getTracks(), getStats()])

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "under_review":
        return "bg-blue-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "low":
        return "border-green-500 bg-green-50"
      default:
        return ""
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "under_review":
        return <Eye className="h-4 w-4" />
      case "approved":
        return <Check className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Music Submissions</h1>
          <p className="text-muted-foreground">Review and manage submitted tracks</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{stats.totalTracks} Total</Badge>
          <Badge className="bg-yellow-500">{stats.pendingTracks} Pending</Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search by title, artist, or email..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {allTracks.map((track) => (
          <Card key={track.id} className={`${getPriorityColor(track.priority)} hover:shadow-md transition-shadow`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getStatusColor(track.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(track.status)}
                      {track.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{track.genre}</Badge>
                    <Badge
                      variant={
                        track.priority === "high"
                          ? "destructive"
                          : track.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {track.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{track.title}</CardTitle>
                  <CardDescription>by {track.artist}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>Submitted: {new Date(track.created_at).toLocaleDateString()}</span>
                    <span>{track.plays} plays</span>
                    <span>{track.likes} likes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <form action={updateTrackStatus.bind(null, track.id, "approved")}>
                    <Button type="submit" variant="ghost" size="sm">
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                  </form>
                  <form action={updateTrackStatus.bind(null, track.id, "under_review")}>
                    <Button type="submit" variant="ghost" size="sm">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                  </form>
                  <form action={updateTrackStatus.bind(null, track.id, "rejected")}>
                    <Button type="submit" variant="ghost" size="sm">
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </form>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2 mb-4">{track.description}</p>
              {track.admin_notes && (
                <div className="mb-4 p-2 bg-muted rounded text-sm">
                  <strong>Admin Notes:</strong> {track.admin_notes}
                </div>
              )}
              <AudioPlayer
                track={{
                  id: track.id,
                  title: track.title,
                  artist: track.artist,
                  file_url: track.file_url,
                  image_url: track.image_url,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTracks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingTracks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedTracks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedTracks}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
