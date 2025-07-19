"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, Music, ImageIcon, CheckCircle, AlertCircle, Play, Pause } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { submitTrack, uploadAudioFile } from "@/lib/db"

export default function SubmitPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    email: "",
    mood: "",
  })

  const genres = [
    "Hip Hop",
    "R&B",
    "Pop",
    "Rock",
    "Electronic",
    "Jazz",
    "Blues",
    "Country",
    "Folk",
    "Classical",
    "Reggae",
    "Funk",
    "Soul",
    "Alternative",
    "Indie",
    "Other",
  ]

  const moods = [
    "Action/Fight",
    "Sad",
    "Break Up",
    "Afro Beats",
    "Dance",
    "Sex",
    "Vulnerable",
    "House",
    "Inspirational",
  ]

  // Check authentication
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      console.log("Session in submit page:", session)
      if (session?.user) {
        setUser(session.user)
        setFormData((prev) => ({ ...prev, email: session.user.email || "" }))
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setLoading(false)
    }
  }

  checkAuth()
}, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/m4a", "audio/aac", "audio/mp4", "audio/x-m4a", "audio/mpeg3", "audio/x-mpeg-3", ""]
      const fileName = file.name.toLowerCase()
      const validExtensions = [".mp3", ".wav", ".m4a", ".aac"]
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
      if (!validTypes.includes(file.type) && !hasValidExtension) {
        setErrorMessage("Please upload a valid audio file (MP3, WAV, M4A, AAC)")
        return
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage("Audio file must be less than 50MB")
        return
      }

      setAudioFile(file)
      setErrorMessage("")

      // Create preview URL
      const url = URL.createObjectURL(file)
      setAudioPreview(url)

      // Create audio element for preview
      const audio = new Audio(url)
      setAudioElement(audio)
    }
  }

  const toggleAudioPreview = () => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      audioElement.play()
      setIsPlaying(true)
      audioElement.onended = () => setIsPlaying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setErrorMessage("You must be logged in to submit tracks")
      router.push("/login")
      return
    }

    if (!audioFile) {
      setErrorMessage("Please select an audio file")
      return
    }

    if (!formData.title || !formData.artist || !formData.genre || !formData.email || !formData.mood) {
      setErrorMessage("Please fill in all required fields including track mood")
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      console.log("Starting submission process...")
      setUploadProgress(10)

      let audioUrl = ""
      // Use a default vinyl record cover image for all submissions
      const imageUrl = "/vinyl-cover.png" // Default vinyl record cover image

      // Try to upload audio file if present, but don't fail if upload fails
      if (audioFile) {
        try {
          console.log("Uploading audio file...")
          audioUrl = await uploadAudioFile(audioFile, user.id)
          console.log("Audio uploaded:", audioUrl)
          setUploadProgress(70)
        } catch (audioError) {
          console.warn("Audio upload failed, continuing without file:", audioError)
          setUploadProgress(70)
        }
      } else {
        setUploadProgress(70)
      }

      // Create track record in database - this MUST work
      console.log("Saving to database...")
      const trackData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        email: formData.email,
        mood: formData.mood,
        file_url: audioUrl && audioUrl.trim() !== "" ? audioUrl : undefined, // <-- FIXED HERE
        image_url: imageUrl, // Always use default image
        file_name: audioFile?.name || undefined,
        file_size: audioFile?.size || undefined,
        user_id: user.id,
      }

      console.log("Track data to submit:", trackData)
      const submissionId = await submitTrack(trackData)
      console.log("Submission saved with ID:", submissionId)

      setUploadProgress(100)
      setSubmitStatus("success")

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          artist: "",
          genre: "",
          email: user.email || "",
          mood: "",
        })
        setAudioFile(null)
        setAudioPreview(null)
        setUploadProgress(0)
        setSubmitStatus("idle")

        // Redirect to dashboard
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Submission error:", error)
      setErrorMessage(
        error instanceof Error 
          ? `Failed to submit track: ${error.message}` 
          : "Failed to submit track. Please try again."
      )
      setSubmitStatus("error")
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Music className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md">
          <CardContent className="p-6 text-center">
            <Music className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-gray-300 mb-4">You need to be logged in to submit tracks.</p>
            <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* ...existing code... */}
    </div>
  )
}