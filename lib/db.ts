import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a Supabase client with service role key for admin operations (server-side only)
const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Create a single Supabase client for user operations (avoid multiple instances)
let supabase: any = null
if (typeof window !== 'undefined') {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  }
} else {
  // Server-side: create a fresh instance each time
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

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

// Get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data.map((profile: any) => ({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }))
  } catch (error) {
    console.error("Error getting all users:", error)
    throw error
  }
}

// Update user role (master admin only)
export async function updateUserRole(userId: string, role: "user" | "admin" | "master_admin"): Promise<void> {
  try {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

// Get all tracks/submissions
export async function getTracks(sortBy: "rating" | "newest" = "rating"): Promise<Track[]> {
  try {
    // Get all submissions and sort them based on the sortBy parameter
    const { data, error } = await supabase.from("submissions").select("*")

    if (error) {
      throw error
    }

    // Sort based on the sortBy parameter
    const sortedData = (data || []).sort((a: any, b: any) => {
      if (sortBy === "newest") {
        // Sort by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        // Sort by rating (highest first), then by creation date (newest first) for same ratings
        if (a.rating !== b.rating) {
          const ratingA = a.rating || 0
          const ratingB = b.rating || 0
          return ratingB - ratingA
        }
        
        // If ratings are equal, sort by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return sortedData
  } catch (error) {
    console.error("Error getting tracks:", error)
    throw error
  }
}

// Update track status
export async function updateTrackStatus(
  trackId: string,
  status: Track["status"],
  rating?: number,
  adminNotes?: string,
  _priority?: undefined, // Keep parameter for backward compatibility but ignore it
  reviewedBy?: string,
): Promise<void> {
  try {
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
    }

    if (rating !== undefined) updateData.rating = rating
    if (adminNotes !== undefined) updateData.admin_notes = adminNotes
    if (reviewedBy !== undefined) updateData.reviewed_by = reviewedBy

    const { error } = await supabase.from("submissions").update(updateData).eq("id", trackId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error updating track status:", error)
    throw error
  }
}

// Update multiple track statuses
export async function updateMultipleTrackStatus(
  trackIds: string[],
  status: Track["status"],
  adminNotes?: string,
  reviewedBy?: string,
): Promise<void> {
  try {
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
    }

    if (adminNotes) updateData.admin_notes = adminNotes
    if (reviewedBy) updateData.reviewed_by = reviewedBy

    const { error } = await supabase.from("submissions").update(updateData).in("id", trackIds)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error updating multiple track statuses:", error)
    throw error
  }
}

// Get single track by ID
export async function getTrackById(trackId: string): Promise<Track | null> {
  try {
    const { data, error } = await supabase.from("submissions").select("*").eq("id", trackId).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error getting track by ID:", error)
    return null
  }
}

// Submit a new track
export async function submitTrack(trackData: {
  title: string
  artist: string
  email: string
  genre: string
  mood?: string
  file_url?: string
  file_name?: string
  file_size?: number
  image_url?: string
  user_id: string
}): Promise<string> {
  try {
    console.log("submitTrack called with data:", trackData)
    
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        ...trackData,
        status: "pending",
      })
      .select("id")
      .single()

    if (error) {
      console.error("Database insert error:", error)
      throw error
    }

    console.log("Track inserted successfully with ID:", data.id)
    return data.id
  } catch (error) {
    console.error("Error submitting track:", error)
    throw error
  }
}

// Create track (alias for submitTrack for compatibility)
export async function createTrack(trackData: {
  title: string
  artist: string
  email: string
  genre: string
  description?: string
  file_url?: string
  file_name?: string
  file_size?: number
  image_url?: string
  user_id: string
}): Promise<string> {
  return submitTrack(trackData)
}

// Upload audio file
export async function uploadAudioFile(file: File, userId: string): Promise<string> {
  try {
    console.log("Attempting to upload audio file:", file.name, "Type:", file.type, "Size:", file.size)
    
    // Use the API endpoint to upload with service role
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'tracks')
    formData.append('userId', userId)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Upload failed: ${errorData.error} - ${errorData.details}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(`Upload failed: ${result.error}`)
    }

    console.log("Audio uploaded successfully:", result.url)
    return result.url
  } catch (error) {
    console.error("Error uploading audio file:", error)
    throw error
  }
}

// Upload image file
export async function uploadImageFile(file: File, userId: string): Promise<string> {
  try {
    console.log("Attempting to upload image file:", file.name, "Type:", file.type, "Size:", file.size)
    
    // Use the API endpoint to upload with service role
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'images')
    formData.append('userId', userId)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Upload failed: ${errorData.error} - ${errorData.details}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(`Upload failed: ${result.error}`)
    }

    console.log("Image uploaded successfully:", result.url)
    return result.url
  } catch (error) {
    console.error("Error uploading image file:", error)
    throw error
  }
}

// Delete user (admin only)
export async function deleteUser(userId: string): Promise<void> {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin operations are only available on the server-side")
    }
    
    // Use admin client to delete user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Create user with admin privileges
export async function createUserWithRole(
  email: string,
  password: string,
  fullName?: string,
  role: "user" | "admin" | "master_admin" = "user",
): Promise<string> {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin operations are only available on the server-side")
    }
    
    // Use admin client to create user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: fullName,
      },
      email_confirm: true,
    })

    if (error) {
      throw error
    }

    if (!data.user) {
      throw new Error("Failed to create user")
    }

    // Create profile
    await createUserProfile(data.user.id, email, fullName, role)

    return data.user.id
  } catch (error) {
    console.error("Error creating user with role:", error)
    throw error
  }
}

// Sync Finalization Functions
export async function saveSyncFinalization(data: Omit<SyncFinalization, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<SyncFinalization> {
  try {
    console.log("saveSyncFinalization called with simplified data entry:", { track_id: data.track_id, user_email: data.email })
    
    // Simple data entry - no authentication or ownership verification
    // This is for admin review purposes only
    console.log("Saving sync finalization data for admin review...")
    
    // Use service role key for direct database access without RLS restrictions
    const client = supabaseAdmin || supabase
    
    // Since this is just data entry, we'll use a placeholder UUID for user_id
    // or we could modify the table to make user_id nullable for these entries
    const placeholderUserId = crypto.randomUUID();
    
    const { data: result, error } = await client
      .from('sync_finalizations')
      .upsert({
        ...data,
        user_id: placeholderUserId, // Use a generated UUID since this is just data entry
        status: 'pending_admin_review', // Mark for admin review instead of completed
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'track_id'
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving sync finalization:", error)
      
      // Simple error messages for data entry form
      if (error.code === '23505') {
        throw new Error("This track has already been submitted for sync finalization.")
      } else if (error.code === '42P01') {
        throw new Error("Database table not found. Please contact admin.")
      } else if (error.code === '23503') {
        throw new Error("Invalid track reference. Please ensure the track exists.")
      } else {
        throw new Error(`Unable to save sync finalization: ${error.message}`)
      }
    }

    if (!result) {
      throw new Error("No data returned from database. Please try again.")
    }

    console.log("Sync finalization saved successfully for admin review:", result.id)
    return result
  } catch (error) {
    console.error("Error in saveSyncFinalization:", error)
    throw error
  }
}

export async function getSyncFinalization(trackId: string): Promise<SyncFinalization | null> {
  try {
    const client = supabaseAdmin || supabase
    
    const { data, error } = await client
      .from('sync_finalizations')
      .select('*')
      .eq('track_id', trackId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error getting sync finalization:", error)
      throw error
    }

    return data || null
  } catch (error) {
    console.error("Error in getSyncFinalization:", error)
    return null
  }
}

export async function checkSyncFinalizationStatus(trackId: string): Promise<"not_started" | "completed" | "requires_updates"> {
  try {
    const finalization = await getSyncFinalization(trackId)
    if (!finalization) {
      return "not_started"
    }
    return finalization.status as "completed" | "requires_updates"
  } catch (error) {
    console.error("Error checking sync finalization status:", error)
    return "not_started"
  }
}

// Chat/Messaging Functions
export async function createChatSession(trackId: string, userId: string, adminId?: string): Promise<SyncChatSession> {
  try {
    const client = supabaseAdmin || supabase
    
    const { data, error } = await client
      .from('sync_chat_sessions')
      .upsert({
        track_id: trackId,
        user_id: userId,
        admin_id: adminId,
        status: 'open',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'track_id'
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating chat session:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in createChatSession:", error)
    throw error
  }
}

export async function getChatSession(trackId: string): Promise<SyncChatSession | null> {
  try {
    const client = supabaseAdmin || supabase
    
    const { data, error } = await client
      .from('sync_chat_sessions')
      .select('*')
      .eq('track_id', trackId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error("Error getting chat session:", error)
      throw error
    }

    return data || null
  } catch (error) {
    console.error("Error in getChatSession:", error)
    return null
  }
}

export async function sendSyncMessage(trackId: string, senderId: string, senderRole: "user" | "admin", message: string): Promise<SyncMessage> {
  try {
    const client = supabaseAdmin || supabase
    
    const { data, error } = await client
      .from('sync_messages')
      .insert({
        track_id: trackId,
        sender_id: senderId,
        sender_role: senderRole,
        message: message
      })
      .select()
      .single()

    if (error) {
      console.error("Error sending sync message:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in sendSyncMessage:", error)
    throw error
  }
}

export async function getSyncMessages(trackId: string): Promise<SyncMessage[]> {
  try {
    const client = supabaseAdmin || supabase
    
    const { data, error } = await client
      .from('sync_messages')
      .select('*')
      .eq('track_id', trackId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error("Error getting sync messages:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getSyncMessages:", error)
    return []
  }
}

export async function closeChatSession(trackId: string): Promise<void> {
  try {
    const client = supabaseAdmin || supabase
    
    const { error } = await client
      .from('sync_chat_sessions')
      .update({ 
        status: 'closed',
        updated_at: new Date().toISOString()
      })
      .eq('track_id', trackId)

    if (error) {
      console.error("Error closing chat session:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in closeChatSession:", error)
    throw error
  }
}

export async function getPendingSyncNotifications(): Promise<{ trackId: string, trackTitle: string, artistName: string, completedAt: string }[]> {
  try {
    const client = supabaseAdmin || supabase
    
    const { data, error } = await client
      .from('sync_finalizations')
      .select(`
        track_id,
        created_at,
        tracks!inner (
          title,
          artist
        )
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error getting pending sync notifications:", error)
      throw error
    }

    return (data || []).map((item: any) => ({
      trackId: item.track_id,
      trackTitle: item.tracks.title,
      artistName: item.tracks.artist,
      completedAt: item.created_at
    }))
  } catch (error) {
    console.error("Error in getPendingSyncNotifications:", error)
    return []
  }
}
