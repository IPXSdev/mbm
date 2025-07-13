export interface Track {
  id: string
  title: string
  artist: string
  genre: string
  description: string
  file_url: string
  image_url?: string
  plays: number
  likes: number
  shares: number
  status: "pending" | "under_review" | "approved" | "rejected"
  user_id: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Episode {
  id: string
  title: string
  artist: string
  description: string
  duration: string
  audio_url: string
  image_url?: string
  plays: number
  published_at: string
  featured: boolean
  created_at: string
  updated_at: string
}

// Mock data for development
const mockTracks: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Rodriguez",
    genre: "indie",
    description: "A dreamy indie track with ethereal vocals and shimmering guitars.",
    file_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image_url: "/placeholder.svg?height=300&width=300",
    plays: 45230,
    likes: 3420,
    shares: 890,
    status: "approved",
    user_id: "dev-user-id",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Electric Nights",
    artist: "Marcus Thompson",
    genre: "electronic",
    description: "Pulsing electronic beats with atmospheric synths.",
    file_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image_url: "/placeholder.svg?height=300&width=300",
    plays: 38950,
    likes: 2890,
    shares: 720,
    status: "approved",
    user_id: "dev-user-id",
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
]

const mockEpisodes: Episode[] = [
  {
    id: "1",
    title: "The Making of Midnight Dreams",
    artist: "Luna Rodriguez",
    description: "Luna shares the emotional journey behind her breakthrough single.",
    duration: "45:32",
    audio_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image_url: "/placeholder.svg?height=300&width=300",
    plays: 12500,
    published_at: "2024-01-15T10:00:00Z",
    featured: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

// Mock functions
export async function getTracks(status?: string) {
  await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate API delay
  if (status) {
    return mockTracks.filter((track) => track.status === status)
  }
  return mockTracks
}

export async function getApprovedTracks() {
  return getTracks("approved")
}

export async function getTrackById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockTracks.find((track) => track.id === id) || null
}

export async function getTopTracks(limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockTracks.sort((a, b) => b.plays - a.plays).slice(0, limit)
}

export async function getEpisodes() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockEpisodes
}

export async function getFeaturedEpisodes() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockEpisodes.filter((episode) => episode.featured)
}

export async function getStats() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return {
    totalTracks: mockTracks.length,
    pendingTracks: mockTracks.filter((t) => t.status === "pending").length,
    approvedTracks: mockTracks.filter((t) => t.status === "approved").length,
    rejectedTracks: mockTracks.filter((t) => t.status === "rejected").length,
    totalEpisodes: mockEpisodes.length,
    totalUsers: 1,
  }
}

export async function getUserTracks(userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockTracks.filter((track) => track.user_id === userId)
}

// Placeholder functions for other data types
export async function getProducts() {
  return []
}

export async function getFeaturedProducts() {
  return []
}

export async function getAnnouncements() {
  return []
}

export async function getPinnedAnnouncements() {
  return []
}
