import { supabase } from "./supabase-client"

export interface Track {
  id: string
  title: string
  artist: string
  genre: string
  description?: string
  file_url: string
  image_url?: string
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
  published_at: string
  featured: boolean
  created_at: string
  updated_at: string
}

// Fetch all tracks (optionally filter by status)
export async function getTracks(status?: string): Promise<Track[]> {
  let query = supabase.from("submissions").select("*")
  if (status) {
    query = query.eq("status", status)
  }
  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) throw error
  return data
}

// Fetch all episodes
export async function getEpisodes(): Promise<Episode[]> {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .order("published_at", { ascending: false })
  if (error) throw error
  return data || []
}

// Fetch featured episodes (where featured = true)
export async function getFeaturedEpisodes(): Promise<Episode[]> {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("featured", true)
    .order("published_at", { ascending: false })
  if (error) throw error
  return data || []
}

// Fetch top tracks (example: by rating, descending)
export async function getTopTracks(limit: number = 10): Promise<Track[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}