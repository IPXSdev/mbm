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