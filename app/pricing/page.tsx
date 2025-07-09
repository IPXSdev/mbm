import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Zap, Crown, Play, Users, Headphones } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Get a taste of industry access",
    icon: Star,
    features: [
      "Access select podcast clips",
      "Watch exclusive behind-the-scenes sneak peeks",
      "Stay up to date with artist placement news & announcements",
    ],
    limitations: ["Limited content access", "No music submission", "No A&R feedback"],
    popular: false,
    cta: "Start Free",
    tier: "TIER 1",
  },
  {
    name: "Creator",
    price: 19.99,
    description: "Get your music in front of A&Rs",
    icon: Zap,
    features: [
      "Submit 1 song per month for pro feedback",
      "Get extended behind-the-scenes access",
      "Your music will be played for A&Rs",
      "Music matched against film & TV scenes to test sync fit",
      "Reviewed in deep-dive breakdowns with the hosts",
      "Be eligible for placement opportunities & more",
    ],
    limitations: [],
    popular: true,
    cta: "Start Creating",
    tier: "TIER 2",
  },
  {
    name: "Pro",
    price: 24.99,
    description: "Maximum exposure & industry access",
    icon: Crown,
    features: [
      "Submit up to 2 songs/month",
      "Unlock ALL behind-the-scenes footage",
      "Music reviewed by A&Rs",
      "Music tested against sync scenes",
      "Receive detailed breakdowns with production insight",
      "Weekly DJ sets featuring subscriber music",
      "Hosted by Big Tank, Rockwilder, and Mr. Porter",
      "Your songs spun live. Your name in the mix.",
    ],
    limitations: [],
    popular: false,
    cta: "Go Pro",
    tier: "TIER 3",
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Path to Placement</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get your music in front of A&Rs and tested for sync opportunities in major TV shows and films
        </p>
      </div>

      {/* Industry Credibility */}
      <div className="text-center mb-12 p-6 bg-gradient-to-r from-purple-900 to-black text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Featuring Industry Heavyweights</h2>
        <div className="flex flex-wrap justify-center gap-4 text-lg">
          <Badge variant="secondary" className="bg-white text-black">
            Big Tank
          </Badge>
          <Badge variant="secondary" className="bg-white text-black">
            Rockwilder
          </Badge>
          <Badge variant="secondary" className="bg-white text-black">
            Mr. Porter
          </Badge>
        </div>
        <p className="mt-4 text-gray-300">The same A&Rs who decide what music gets placed in your favorite shows</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const IconComponent = plan.icon
          return (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${plan.popular ? "border-purple-500 shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                <Badge variant="outline" className="w-fit mx-auto mb-2">
                  {plan.tier}
                </Badge>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? "bg-purple-600 text-white" : "bg-muted"}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Success Stories Preview */}
      <div className="bg-muted p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Recent Placements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Play className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Artist Name</h3>
              <p className="text-sm text-muted-foreground">Placed in BMF Season 3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Artist Name</h3>
              <p className="text-sm text-muted-foreground">Featured in Power Universe</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Headphones className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Artist Name</h3>
              <p className="text-sm text-muted-foreground">Sync placement in major film</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How does the A&R review process work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your submitted music goes directly to our team of industry A&Rs who review it for placement
                opportunities. They provide professional feedback and test your music against actual TV/film scenes to
                find sync opportunities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What shows and films do you work with?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We work with major productions including BMF, the Power Universe, and other high-profile TV shows and
                films. Our A&R team has direct connections with music supervisors across the industry.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How quickly will I hear back about my submission?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All submissions receive professional feedback within 2-3 weeks. If your music is selected for placement
                opportunities, you'll be contacted directly by our team.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can change your subscription tier at any time. Upgrades take effect immediately, and you'll
                have access to all features of your new tier right away.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-900 to-black text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Your Music Placed?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join the platform where indie artists get real opportunities to have their music featured in major TV shows
          and films.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            Start Your Subscription
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black bg-transparent"
          >
            Watch Success Stories
          </Button>
        </div>
      </div>
    </div>
  )
}
