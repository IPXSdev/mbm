
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with service role key for admin operations (server-side only)
const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Create a regular Supabase client for user operations
const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
  priority?: "low" | "medium" | "high"
  rating?: number
  admin_notes?: string
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
  description?: string
  image_url?: string
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
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

    return data.map((profile) => ({
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
export async function getTracks(): Promise<Track[]> {
  try {
    const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
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
  priority?: Track["priority"],
  reviewedBy?: string,
): Promise<void> {
  try {
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
    }

    if (rating !== undefined) updateData.rating = rating
    if (adminNotes !== undefined) updateData.admin_notes = adminNotes
    if (priority !== undefined) updateData.priority = priority
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
  description?: string
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
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    console.log("Attempting to upload audio file:", fileName)
    const { data, error } = await supabase.storage.from("audio-files").upload(fileName, file)

    if (error) {
      console.error("Audio upload error:", error)
      // If bucket doesn't exist, create a fallback URL
      if (error.message.includes("Bucket not found")) {
        console.warn("Audio bucket not found, using fallback")
        return `fallback-audio-${Date.now()}`
      }
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("audio-files").getPublicUrl(fileName)

    console.log("Audio uploaded successfully:", publicUrl)
    return publicUrl
  } catch (error) {
    console.error("Error uploading audio file:", error)
    // Return a fallback instead of throwing
    return `fallback-audio-${Date.now()}`
  }
}

// Upload image file
export async function uploadImageFile(file: File, userId: string): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    console.log("Attempting to upload image file:", fileName)
    const { data, error } = await supabase.storage.from("images").upload(fileName, file)

    if (error) {
      console.error("Image upload error:", error)
      // If bucket doesn't exist, create a fallback URL
      if (error.message.includes("Bucket not found")) {
        console.warn("Image bucket not found, using fallback")
        return `fallback-image-${Date.now()}`
      }
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName)

    console.log("Image uploaded successfully:", publicUrl)
    return publicUrl
  } catch (error) {
    console.error("Error uploading image file:", error)
    // Return a fallback instead of throwing
    return `fallback-image-${Date.now()}`
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
