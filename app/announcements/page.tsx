import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Bell, Pin } from "lucide-react"

const announcements = [
  {
    id: 1,
    title: "New Episode: Behind the Scenes with Luna Rodriguez",
    content:
      "We're excited to announce our latest episode featuring Luna Rodriguez discussing the making of her hit single 'Midnight Dreams'. This intimate conversation reveals the creative process, late-night studio sessions, and the emotional journey behind one of this year's most compelling tracks.",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "Episode Release",
    pinned: true,
    urgent: false,
  },
  {
    id: 2,
    title: "Submission Guidelines Update",
    content:
      "We've updated our music submission guidelines to better serve our artist community. New features include faster review times, expanded genre categories, and improved feedback systems. All existing submissions will be grandfathered under the previous guidelines.",
    date: "2024-01-12",
    time: "2:30 PM",
    type: "Platform Update",
    pinned: true,
    urgent: true,
  },
  {
    id: 3,
    title: "January Leaderboard Winners Announced",
    content:
      "Congratulations to our top performers this month! Luna Rodriguez takes the #1 spot with 'Midnight Dreams', followed by Marcus Thompson's 'Electric Nights' and Sarah Williams' 'Country Roads Home'. Winners receive featured placement and exclusive merchandise.",
    date: "2024-01-10",
    time: "5:00 PM",
    type: "Leaderboard",
    pinned: false,
    urgent: false,
  },
  {
    id: 4,
    title: "New Merch Drop: Limited Edition Vinyl Collection",
    content:
      "Our exclusive vinyl collection featuring top tracks from our featured artists is now available in the store. Limited quantities available - each vinyl comes with signed artwork and exclusive behind-the-scenes content.",
    date: "2024-01-08",
    time: "12:00 PM",
    type: "Store Update",
    pinned: false,
    urgent: false,
  },
  {
    id: 5,
    title: "Scheduled Maintenance: January 20th",
    content:
      "We'll be performing scheduled maintenance on January 20th from 2:00 AM to 4:00 AM EST. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience and appreciate your patience.",
    date: "2024-01-05",
    time: "9:00 AM",
    type: "Maintenance",
    pinned: false,
    urgent: true,
  },
  {
    id: 6,
    title: "Community Spotlight: Rising Artists",
    content:
      "This month we're highlighting emerging artists who are making waves in our community. From bedroom producers to indie singer-songwriters, discover the next generation of musical talent and the stories behind their art.",
    date: "2024-01-03",
    time: "3:15 PM",
    type: "Community",
    pinned: false,
    urgent: false,
  },
]

function getTypeColor(type: string) {
  switch (type) {
    case "Episode Release":
      return "bg-blue-500"
    case "Platform Update":
      return "bg-green-500"
    case "Leaderboard":
      return "bg-yellow-500"
    case "Store Update":
      return "bg-purple-500"
    case "Maintenance":
      return "bg-red-500"
    case "Community":
      return "bg-indigo-500"
    default:
      return "bg-gray-500"
  }
}

export default function AnnouncementsPage() {
  const pinnedAnnouncements = announcements.filter((a) => a.pinned)
  const regularAnnouncements = announcements.filter((a) => !a.pinned)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Announcements</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with the latest news, updates, and community highlights
        </p>
      </div>

      {/* Notification Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how you receive updates from Man Behind The Music</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Email Notifications
            </Button>
            <Button variant="outline" size="sm">
              Episode Releases
            </Button>
            <Button variant="outline" size="sm">
              Platform Updates
            </Button>
            <Button variant="outline" size="sm">
              Leaderboard Updates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Pin className="h-5 w-5" />
            Pinned Announcements
          </h2>
          <div className="space-y-4">
            {pinnedAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Pin className="h-4 w-4 text-primary" />
                        <Badge className={`${getTypeColor(announcement.type)} text-white`}>{announcement.type}</Badge>
                        {announcement.urgent && <Badge variant="destructive">Urgent</Badge>}
                      </div>
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(announcement.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {announcement.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Announcements</h2>
        <div className="space-y-6">
          {regularAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getTypeColor(announcement.type)} text-white`}>{announcement.type}</Badge>
                      {announcement.urgent && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(announcement.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {announcement.time}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Announcements
        </Button>
      </div>
    </div>
  )
}
