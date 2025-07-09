"use server"

import { createClient } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitTrack(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const title = formData.get("title") as string
  const artist = formData.get("artist") as string
  const genre = formData.get("genre") as string
  const description = formData.get("description") as string
  const email = formData.get("email") as string
  const socialLinks = formData.get("socialLinks") as string

  // Handle file upload
  const audioFile = formData.get("audioFile") as File
  const imageFile = formData.get("imageFile") as File | null

  if (!audioFile) {
    return { error: "Audio file is required" }
  }

  // Upload audio file
  const audioFileName = `${user.id}/${Date.now()}-${audioFile.name}`
  const { data: audioUpload, error: audioError } = await supabase.storage
    .from("tracks")
    .upload(audioFileName, audioFile)

  if (audioError) {
    return { error: "Failed to upload audio file" }
  }

  // Upload image file if provided
  let imageUrl = null
  if (imageFile) {
    const imageFileName = `${user.id}/${Date.now()}-${imageFile.name}`
    const { data: imageUpload, error: imageError } = await supabase.storage
      .from("images")
      .upload(imageFileName, imageFile)

    if (!imageError) {
      const { data: imageUrlData } = supabase.storage.from("images").getPublicUrl(imageUpload.path)
      imageUrl = imageUrlData.publicUrl
    }
  }

  // Get audio file URL
  const { data: audioUrlData } = supabase.storage.from("tracks").getPublicUrl(audioUpload.path)

  // Create track record
  const { data: track, error: dbError } = await supabase
    .from("tracks")
    .insert({
      title,
      artist,
      genre,
      description,
      file_url: audioUrlData.publicUrl,
      image_url: imageUrl,
      user_id: user.id,
      status: "pending",
    })
    .select()
    .single()

  if (dbError) {
    return { error: "Failed to save track information" }
  }

  revalidatePath("/submit")
  revalidatePath("/admin/submissions")

  return { success: true, track }
}

export async function updateTrackStatus(trackId: string, status: string, adminNotes?: string) {
  await requireAuth() // Could add admin check here
  const supabase = await createClient()

  const { error } = await supabase
    .from("tracks")
    .update({
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", trackId)

  if (error) {
    return { error: "Failed to update track status" }
  }

  revalidatePath("/admin/submissions")
  revalidatePath("/leaderboard")

  return { success: true }
}
