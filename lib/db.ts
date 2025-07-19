import { supabase } from "./supabase-client"
import { createClient } from "@supabase/supabase-js"

// Use service role key for admin operations (server-side only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

// Only instantiate admin client on the server
const supabaseAdmin =
  typeof window === 'undefined' && supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin" | "master_admin"
  created_at: string
  updated_at: string
}

export interface Track {
  id: string
  user_id: string
  title: string
  artist: string
  email: string
  genre: string
  file_url?: string
  file_name?: string
  file_size?: number
  status: "pending" | "under_review" | "approved" | "rejected"
  rating?: number
  admin_notes?: string
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
  mood?: string
  image_url?: string
}

// Sync Finalization Types
export interface SyncFinalization {
  id: string
  track_id: string
  user_id: string
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  contact_number: string
  pro_plan: string
  pro_number: string
  publisher_name: string
  publisher_pro: string
  publisher_number: string
  copyright_owner: string
  master_owner: string
  isrc?: string
  upc?: string
  territory_rights: string
  duration: string
  bpm?: string
  key?: string
  lyrics?: string
  instrumental_available: boolean
  additional_notes?: string
  contributors: any[] // JSON array
  status: "pending" | "completed" | "requires_updates"
  created_at: string
  updated_at: string
}

export interface SyncMessage {
  id: string
  track_id: string
  sender_id: string
  sender_role: "user" | "admin"
  message: string
  created_at: string
}

export interface SyncChatSession {
  id: string
  track_id: string
  user_id: string
  admin_id?: string
  status: "open" | "closed"
  created_at: string
  updated_at: string
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.log("No auth user found:", error)
      return null
    }

    console.log("Auth user found:", user.id, user.email)

    // Try to get profile, but don't fail if profiles table doesn't exist
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profileError && profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        }
      }
    } catch (profileErr) {
      console.log("Profiles table not accessible, using auth user directly")
    }

    // Fallback: use auth user data directly
    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
      role: "user", // Default role
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Create or update user profile
export async function createUserProfile(
  userId: string,
  email: string,
  fullName?: string,
  role: "user" | "admin" | "master_admin" = "user",
): Promise<void> {
  try {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      name: fullName,
      role,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// ...existing code for user, track, and chat functions...

// Sync Finalization Functions
export async function saveSyncFinalization(
  data: Omit<SyncFinalization, 'id' | 'created_at' | 'updated_at' | 'status'> & { user_id: string }
): Promise<SyncFinalization> {
  try {
    console.log("saveSyncFinalization called with data:", { track_id: data.track_id, user_id: data.user_id, user_email: data.email })
    // For simple data entry, use admin client if server-side, otherwise use singleton
    const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase
    const { data: result, error } = await client
      .from('sync_finalizations')
      .upsert({
        ...data,
        status: 'pending_admin_review',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'track_id'
      })
      .select()
      .single()
    if (error) {
      if (error.code === '23505') {
        throw new Error("This track has already been submitted for sync finalization.")
      } else if (error.code === '42P01') {
        throw new Error("Database table not found. Please contact admin.")
      } else if (error.code === '23503') {
        throw new Error("Invalid track reference. Please ensure the track exists.")
      } else if (error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        throw new Error("Database access restricted. Please contact admin to disable RLS for sync_finalizations table.")
      } else {
        throw new Error(`Unable to save sync finalization: ${error.message}`)
      }
    }
    if (!result) {
      throw new Error("No data returned from database. Please try again.")
    }
    return result
  } catch (error) {
    console.error("Error in saveSyncFinalization:", error)
    throw error
  }
}

// ...existing code for getSyncFinalization, checkSyncFinalizationStatus, chat, and notification functions...