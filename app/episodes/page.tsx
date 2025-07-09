import { getEpisodes, getFeaturedEpisodes } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AudioPlayer } from "@/components/audio-player"
import { Clock, Calendar, Search, Filter } from "lucide-react"
import Image from "next/image"

export default async function EpisodesPage() {
  const [episodes, featuredEpisodes] = await Promise.all([getEpisodes(), getFeaturedEpisodes()])

  const featuredEpisode = featuredEpisodes[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Podcast Episodes</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Deep conversations with artists about their creative process, inspiration, and the stories behind their music
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search episodes, artists, or topics..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Featured Episode */}
      {featuredEpisode && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Episode</h2>
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <Image
                  src={featuredEpisode.image_url || "/placeholder.svg?height=300&width=400"}
                  alt="Featured Episode"
                  width={400}
                  height={300}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>Featured</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">{featuredEpisode.title}</h3>
                <p className="text-lg text-muted-foreground mb-4">with {featuredEpisode.artist}</p>
                <p className="text-muted-foreground mb-6">{featuredEpisode.description}</p>
                <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredEpisode.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredEpisode.published_at).toLocaleDateString()}
                  </div>
                  <div>{featuredEpisode.plays.toLocaleString()} plays</div>
                </div>
                <AudioPlayer
                  track={{
                    id: featuredEpisode.id,
                    title: featuredEpisode.title,
                    artist: featuredEpisode.artist,
                    file_url: featuredEpisode.audio_url,
                    image_url: featuredEpisode.image_url,
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Episodes */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Episodes</h2>
        <div className="grid gap-6">
          {episodes.map((episode) => (
            <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-48 flex-shrink-0">
                  <Image
                    src={episode.image_url || "/placeholder.svg?height=200&width=200"}
                    alt={episode.title}
                    width={200}
                    height={200}
                    className="w-full h-32 md:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">{episode.featured && <Badge>Featured</Badge>}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{episode.title}</h3>
                  <p className="text-lg text-muted-foreground mb-3">with {episode.artist}</p>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{episode.description}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {episode.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(episode.published_at).toLocaleDateString()}
                    </div>
                    <div>{episode.plays.toLocaleString()} plays</div>
                  </div>
                  <AudioPlayer
                    track={{
                      id: episode.id,
                      title: episode.title,
                      artist: episode.artist,
                      file_url: episode.audio_url,
                      image_url: episode.image_url,
                    }}
                    className="mt-4"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Episodes
        </Button>
      </div>
    </div>
  )
}
