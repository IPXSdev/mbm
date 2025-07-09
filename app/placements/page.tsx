import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tv, Music, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PlacementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Placement Success Stories</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See where our artists' music is being featured and get inspired for your own placement journey
        </p>
      </div>

      {/* Featured Placement */}
      <div className="mb-12">
        <Card className="overflow-hidden bg-gradient-to-r from-purple-900 to-black text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-white text-black mb-4">Latest Placement</Badge>
                <h2 className="text-3xl font-bold mb-4">BMF: Black Mafia Family</h2>
                <p className="text-xl mb-6">
                  Another one of our artists just got their track placed in the latest season of BMF. From submission to
                  screen in just 3 months.
                </p>
                <div className="space-y-2 text-sm mb-6">
                  <p>• Executive Producer: Curtis "50 Cent" Jackson</p>
                  <p>• Network: STARZ</p>
                  <p>• Placement Type: Background Score</p>
                </div>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Submit Your Music
                </Button>
              </div>
              <div>
                <Image
                  src="/images/bmf-poster.jpg"
                  alt="BMF Placement"
                  width={400}
                  height={500}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placement Opportunities */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Where Your Music Could Be Next</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Tv className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>TV Series</CardTitle>
              <CardDescription>Major network and streaming shows</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• BMF: Black Mafia Family</li>
                <li>• Power Universe</li>
                <li>• Empire</li>
                <li>• Atlanta</li>
                <li>• Snowfall</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Music className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Films</CardTitle>
              <CardDescription>Independent and major studio films</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Independent Features</li>
                <li>• Studio Productions</li>
                <li>• Documentary Films</li>
                <li>• Short Films</li>
                <li>• Web Series</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Commercials</CardTitle>
              <CardDescription>Brand campaigns and advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• National TV Commercials</li>
                <li>• Digital Campaigns</li>
                <li>• Brand Partnerships</li>
                <li>• Social Media Ads</li>
                <li>• Product Launches</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Stats */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Track Record</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold mb-1">150+</div>
              <p className="text-sm text-muted-foreground">Successful Placements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Tv className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold mb-1">25+</div>
              <p className="text-sm text-muted-foreground">TV Shows & Films</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Music className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold mb-1">500+</div>
              <p className="text-sm text-muted-foreground">Artists Represented</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold mb-1">$2M+</div>
              <p className="text-sm text-muted-foreground">Artist Earnings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">From Submission to Screen</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-bold mb-2">Submit</h3>
            <p className="text-sm text-muted-foreground">Upload your track through our platform</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-bold mb-2">Review</h3>
            <p className="text-sm text-muted-foreground">A&Rs evaluate and test your music</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-bold mb-2">Match</h3>
            <p className="text-sm text-muted-foreground">We find the perfect sync opportunity</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="font-bold mb-2">Placement</h3>
            <p className="text-sm text-muted-foreground">Your music goes live on screen</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to See Your Music on Screen?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join hundreds of artists who have successfully placed their music in major TV shows and films through our
          platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/pricing">View Subscription Plans</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/podcast">Watch Success Stories</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
