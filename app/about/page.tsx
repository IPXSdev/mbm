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
                  <Badge className="w-fit mb-4 bg-purple-600">Producer | Music Supervisor | Executive</Badge>
                  <h3 className="text-3xl font-bold mb-4">Big Tank (Derryck Thornton)</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Derryck "Big Tank" Thornton is a dynamic force in the entertainment industry—an influential producer, 
                    music supervisor, and composer who seamlessly blends visionary artistry with strategic leadership. 
                    With an extraordinary career spanning music, television, and film, Big Tank has crafted unforgettable 
                    soundtracks and shaped the sonic identity of culturally iconic projects. He has collaborated with 
                    music's most influential artists including Rihanna, Missy Elliott, Ne-Yo, Christina Aguilera, and 
                    Queen Latifah, while serving as music supervisor for major hits like BMF, Power Saga, Raising Kanan, 
                    and many more across Starz, Apple TV+, Netflix, and other platforms.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Former Senior VP at Sony Music
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Music Supervisor: BMF, Power, Raising Kanan
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Producer for Rihanna, Missy Elliott, Ne-Yo
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
                  <Badge className="w-fit mb-4 bg-blue-600">Grammy-Winning Producer | Creative Visionary</Badge>
                  <h3 className="text-3xl font-bold mb-4">Rockwilder (Dana Stinson)</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Dana "Rockwilder" Stinson is a Grammy Award-winning music producer and creative force whose signature 
                    sound has shaped the sonic identity of hip-hop, R&B, and pop for over two decades. Known for blending 
                    hard-hitting beats with soulful melodies and cutting-edge innovation, Rockwilder is the mastermind behind 
                    some of the most iconic records in modern music, including "Lady Marmalade," "Da Rockwilder," and "Do It." 
                    He has worked with industry legends including Jay-Z, Eminem, Dr. Dre, Busta Rhymes, Mary J. Blige, Janet 
                    Jackson, and Christina Aguilera, delivering chart-topping hits across genres while also composing film scores 
                    like the cult-classic "How High."
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Grammy Award-Winning Producer
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Produced for Jay-Z, Eminem, Dr. Dre
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      "Lady Marmalade" & Iconic Hit Creator
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
                  <Badge className="w-fit mb-4 bg-green-600">Music Executive & Producer</Badge>
                  <h3 className="text-3xl font-bold mb-4">Mr. Porter (Denaun)</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Denaun Porter, professionally known as Mr. Porter, is a multi-platinum Grammy-nominated producer, 
                    songwriter, and music executive. As a core member of D12 and longtime collaborator with Eminem, 
                    he has been instrumental in shaping the sound of Detroit hip-hop for over two decades. Beyond his 
                    work as an artist, Porter has established himself as a powerhouse producer, working with industry 
                    giants and developing emerging talent. His keen ear for placement-ready music and deep industry 
                    connections make him an invaluable asset in connecting independent artists with major opportunities 
                    in TV, film, and media.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Grammy-Nominated Producer
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      D12 Member & Eminem Collaborator
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Multi-Platinum Artist & Executive
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
