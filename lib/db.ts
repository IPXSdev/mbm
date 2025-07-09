import { supabase } from "./supabase-client"

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
  status: "pending" | "approved" | "rejected"
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
}

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "artist" | "admin"
  created_at: string
}

// Track operations
export const getTracks = async (status?: string) => {
  let query = supabase.from("tracks").select("*").order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Track[]
}

export const getTrackById = async (id: string) => {
  const { data, error } = await supabase.from("tracks").select("*").eq("id", id).single()

  if (error) throw error
  return data as Track
}

export const createTrack = async (track: Omit<Track, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("tracks").insert(track).select().single()

  if (error) throw error
  return data as Track
}

export const updateTrackStatus = async (id: string, status: Track["status"]) => {
  const { data, error } = await supabase
    .from("tracks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Track
}

// Episode operations
export const getEpisodes = async () => {
  const { data, error } = await supabase.from("episodes").select("*").order("published_at", { ascending: false })

  if (error) throw error
  return data as Episode[]
}

export const getFeaturedEpisodes = async () => {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("featured", true)
    .order("published_at", { ascending: false })

  if (error) throw error
  return data as Episode[]
}

// User operations
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
