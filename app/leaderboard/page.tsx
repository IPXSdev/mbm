import { getTopTracks } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AudioPlayer } from "@/components/audio-player"
import { Trophy, TrendingUp, Heart, Play, Share2 } from "lucide-react"
import Image from "next/image"

export default async function LeaderboardPage() {
  const topTracks = await getTopTracks(10)

  // Group tracks by artist for top artists
  const artistStats = topTracks.reduce(
    (acc, track) => {
      if (!acc[track.artist]) {
        acc[track.artist] = {
          name: track.artist,
          totalPlays: 0,
          tracks: 0,
          topTrack: track,
        }
      }
      acc[track.artist].totalPlays += track.plays
      acc[track.artist].tracks += 1
      if (track.plays > acc[track.artist].topTrack.plays) {
        acc[track.artist].topTrack = track
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const topArtists = Object.values(artistStats)
    .sort((a: any, b: any) => b.totalPlays - a.totalPlays)
    .slice(0, 5)

  function getRankIcon(rank: number) {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Trophy className="h-6 w-6 text-amber-600" />
    return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Music Leaderboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the most popular tracks and artists in our community
        </p>
      </div>

      <Tabs defaultValue="tracks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="tracks">Top Tracks</TabsTrigger>
          <TabsTrigger value="artists">Top Artists</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks">
          <div className="space-y-4">
            {topTracks.map((track, index) => (
              <Card key={track.id} className={`overflow-hidden ${index < 3 ? "border-primary/20 bg-primary/5" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6 mb-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-16 flex justify-center">{getRankIcon(index + 1)}</div>

                    {/* Album Art */}
                    <div className="flex-shrink-0">
                      <Image
                        src={track.image_url || "/placeholder.svg?height=80&width=80"}
                        alt={track.title}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold truncate">{track.title}</h3>
                        <Badge variant="secondary">{track.genre}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{track.artist}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          {track.plays.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {track.likes.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {track.shares.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audio Player */}
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
        </TabsContent>

        <TabsContent value="artists">
          <div className="space-y-4">
            {topArtists.map((artist: any, index) => (
              <Card
                key={artist.name}
                className={`overflow-hidden ${index < 3 ? "border-primary/20 bg-primary/5" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-16 flex justify-center">{getRankIcon(index + 1)}</div>

                    {/* Artist Avatar */}
                    <div className="flex-shrink-0">
                      <Image
                        src={artist.topTrack.image_url || "/placeholder.svg?height=80&width=80"}
                        alt={artist.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>

                    {/* Artist Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate mb-1">{artist.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          {artist.totalPlays.toLocaleString()} total plays
                        </div>
                        <div>{artist.tracks} tracks</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Top track: {artist.topTrack.title}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plays This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topTracks.reduce((sum, track) => sum + track.plays, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From top tracks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Artists</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topArtists.length}</div>
            <p className="text-xs text-muted-foreground">In top rankings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Track Plays</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topTracks[0]?.plays.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Most popular track</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
