import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PodcastPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">The Man Behind The Music Podcast</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Raw conversations with industry executives who move the culture. Untold stories, real truths, and the inside
          scoop on what it takes to get your music placed.
        </p>
      </div>

      {/* Latest Episodes */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Latest Episodes</h2>
          <p className="text-muted-foreground">
            Watch the latest episodes featuring raw conversations with industry executives
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Episode 1 */}
          <Card className="overflow-hidden">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/s_fqfPiJmb0"
                title="The Man Behind The Music Podcast - Episode 1"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <CardContent className="p-6">
              <Badge className="mb-3 bg-purple-600">Episode 1</Badge>
              <h3 className="text-xl font-bold mb-2">Series Premiere</h3>
              <p className="text-muted-foreground mb-4">
                The inaugural episode of The Man Behind The Music Podcast launches with exclusive industry insights and behind-the-scenes conversations.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  July 2025
                </div>
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  Watch on YouTube
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episode 2 */}
          <Card className="overflow-hidden">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/VLeqmbdnAUs"
                title="The Man Behind The Music Podcast - Episode 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <CardContent className="p-6">
              <Badge className="mb-3 bg-purple-600">Episode 2</Badge>
              <h3 className="text-xl font-bold mb-2">Industry Deep Dive</h3>
              <p className="text-muted-foreground mb-4">
                Continuing the series with more exclusive content and unfiltered conversations about the music placement industry.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  July 2025
                </div>
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  Watch on YouTube
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* YouTube Channel CTA */}
        <div className="text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-red-600 to-red-800 text-white">
            <h3 className="text-xl font-bold mb-2">Subscribe to Our YouTube Channel</h3>
            <p className="mb-4">Get notified when new episodes drop</p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" asChild>
              <Link href="https://www.youtube.com/@Themanbehindthemusicpodcast" target="_blank" rel="noopener noreferrer">
                Subscribe on YouTube
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* Featured Guest Preview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Industry Heavyweights</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              <Image
                src="/images/podcast-big-tank.png"
                alt="Podcast with Big Tank"
                width={400}
                height={600}
                className="w-full h-auto"
              />
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-purple-600">Industry Executive</Badge>
                <h3 className="text-2xl font-bold mb-4">Big Tank</h3>
                <p className="text-muted-foreground mb-6">
                  One of the most influential A&Rs in the industry, Big Tank has been behind some of the biggest
                  placements in entertainment media. Get the inside scoop on what he looks for in music and how artists can get
                  their tracks noticed.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Music placement in major TV shows</p>
                  <p>• A&R insights and industry secrets</p>
                  <p>• What makes a track placement-ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Industry Guests */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">More Industry Legends Coming</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Rockwilder</h3>
              <p className="text-muted-foreground mb-4">Legendary producer and A&R executive</p>
              <Badge variant="outline">Coming Soon</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">MP</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Mr. Porter</h3>
              <p className="text-muted-foreground mb-4">Industry heavyweight and music executive</p>
              <Badge variant="outline">Coming Soon</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">What to Expect</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Play className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-bold mb-2">Unfiltered Conversations</h3>
            <p className="text-muted-foreground">Raw, honest discussions about the music industry</p>
          </div>
          <div className="text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-bold mb-2">Behind-the-Scenes Access</h3>
            <p className="text-muted-foreground">Exclusive content and industry insights</p>
          </div>
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-bold mb-2">Weekly Episodes</h3>
            <p className="text-muted-foreground">New episodes every week starting July 2025</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Don't Miss Out</h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to get exclusive behind-the-scenes content and be notified when new episodes drop
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/pricing">Subscribe for Early Access</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://www.youtube.com/@Themanbehindthemusicpodcast" target="_blank" rel="noopener noreferrer">
              Follow on YouTube
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
