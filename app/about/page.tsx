import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Target, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About The Man Behind The Music</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Meet the industry heavyweights changing the game for indie artists and creators
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <Card className="overflow-hidden bg-gradient-to-r from-purple-900 to-black text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-6 text-white" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl mb-6 max-w-4xl mx-auto leading-relaxed">
                We're changing the game for indie artists & creators by providing direct access to the industry 
                executives who decide what music gets placed in your favorite TV shows and films. No gatekeepers, 
                no middlemen – just real opportunities for real artists.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Music className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Direct Access</h3>
                  <p className="text-sm text-gray-300">Connect directly with A&Rs and music supervisors</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Real Opportunities</h3>
                  <p className="text-sm text-gray-300">Actual placement opportunities in major productions</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Professional Feedback</h3>
                  <p className="text-sm text-gray-300">Industry-level critique to improve your craft</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">The Powerhouse Team</h2>
        
        <div className="space-y-12">
          {/* Big Tank */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-square lg:aspect-auto">
                  <Image
                    src="/images/big-tank.jpg"
                    alt="Big Tank"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-purple-600">Industry Legend</Badge>
                  <h3 className="text-3xl font-bold mb-4">Big Tank</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    [Please provide Big Tank's bio - I'll update this with the content you share. This placeholder 
                    shows the layout where his professional background, achievements, and role in the music industry 
                    will be displayed.]
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      A&R Executive
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Music Placement Specialist
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Industry Heavyweight
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rockwilder */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="order-2 lg:order-1 p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-blue-600">Legendary Producer</Badge>
                  <h3 className="text-3xl font-bold mb-4">Rockwilder</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    [Please provide Rockwilder's bio - I'll update this with the content you share. This placeholder 
                    shows the layout where his legendary production career, hit records, and industry influence 
                    will be displayed.]
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Grammy-Winning Producer
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Hit-Making Machine
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Industry Veteran
                    </p>
                  </div>
                </div>
                <div className="order-1 lg:order-2 aspect-square lg:aspect-auto">
                  <Image
                    src="/images/rockwilder.jpg"
                    alt="Rockwilder"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mr. Porter */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-square lg:aspect-auto">
                  <Image
                    src="/images/mr-porter.jpg"
                    alt="Mr. Porter"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-green-600">Music Executive</Badge>
                  <h3 className="text-3xl font-bold mb-4">Mr. Porter</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    [Please provide Mr. Porter's bio - I'll update this with the content you share. This placeholder 
                    shows the layout where his executive experience, industry connections, and role in music 
                    supervision will be displayed.]
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Music Executive
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Industry Connector
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Placement Expert
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Changing the Industry Together</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          With decades of combined experience, our team has been responsible for countless placements 
          in major TV shows, films, and media. Now we're using that power to elevate independent artists.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
            <p className="text-sm text-muted-foreground">Successful Placements</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <p className="text-sm text-muted-foreground">Major Productions</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
        </div>
      </div>
    </div>
  )
}
