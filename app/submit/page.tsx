"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, Music, FileAudio, ImageIcon, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/auth-client"
import { createTrack, uploadAudioFile, uploadImageFile } from "@/lib/db"

const GENRES = [
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

export default function SubmitPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    description: "",
    email: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        artist: user.user_metadata?.name || "",
      }))
    } catch (error) {
      console.error("Auth error:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (type: "audio" | "image", file: File | null) => {
    if (type === "audio") {
      setAudioFile(file)
    } else {
      setImageFile(file)
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Track title is required")
      return false
    }
    if (!formData.artist.trim()) {
      setError("Artist name is required")
      return false
    }
    if (!formData.genre) {
      setError("Please select a genre")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!audioFile) {
      setError("Audio file is required")
      return false
    }

    // Validate audio file
    const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/mp3"]
    if (!validAudioTypes.includes(audioFile.type)) {
      setError("Please upload a valid audio file (MP3 or WAV)")
      return false
    }

    // Check file size (max 50MB)
    if (audioFile.size > 50 * 1024 * 1024) {
      setError("Audio file must be less than 50MB")
      return false
    }

    // Validate image file if provided
    if (imageFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (!validImageTypes.includes(imageFile.type)) {
        setError("Please upload a valid image file (JPEG or PNG)")
        return false
      }

      if (imageFile.size > 10 * 1024 * 1024) {
        setError("Image file must be less than 10MB")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    setError("")
    setUploadProgress(0)

    try {
      // Upload audio file
      setUploadProgress(25)
      const audioUrl = await uploadAudioFile(audioFile!, user.id)

      // Upload image file if provided
      setUploadProgress(50)
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImageFile(imageFile, user.id)
      }

      // Create track record
      setUploadProgress(75)
      await createTrack({
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        genre: formData.genre,
        description: formData.description.trim(),
        email: formData.email.trim(),
        file_url: audioUrl,
        image_url: imageUrl,
        file_size: audioFile!.size,
        file_name: audioFile!.name,
        user_id: user.id,
      })

      setUploadProgress(100)
      setSuccess(true)

      // Reset form
      setTimeout(() => {
        setFormData({
          title: "",
          artist: user.user_metadata?.name || "",
          genre: "",
          description: "",
          email: user.email || "",
        })
        setAudioFile(null)
        setImageFile(null)
        setSuccess(false)
        setUploadProgress(0)
      }, 3000)
    } catch (err: any) {
      console.error("Submission error:", err)
      setError(err.message || "Failed to submit track. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Track Submitted!</h2>
            <p className="text-gray-300 mb-4">
              Your track has been successfully submitted for review. We'll get back to you soon!
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Submit Your Track</h1>
            <p className="text-gray-300">Share your music with the world</p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5" />
                Track Submission
              </CardTitle>
              <CardDescription className="text-gray-300">
                Fill out the form below to submit your track for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/20 border-red-500/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-white">{error}</AlertDescription>
                  </Alert>
                )}

                {submitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">
                      Track Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter track title"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artist" className="text-white">
                      Artist Name *
                    </Label>
                    <Input
                      id="artist"
                      value={formData.artist}
                      onChange={(e) => handleInputChange("artist", e.target.value)}
                      placeholder="Enter artist name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre" className="text-white">
                      Genre *
                    </Label>
                    <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Tell us about your track..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <FileAudio className="h-4 w-4" />
                      Audio File * (MP3, WAV - Max 50MB)
                    </Label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileChange("audio", e.target.files?.[0] || null)}
                        className="hidden"
                        id="audio-upload"
                        disabled={submitting}
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-white">{audioFile ? audioFile.name : "Click to upload audio file"}</p>
                        <p className="text-gray-400 text-sm">MP3, WAV up to 50MB</p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Cover Image (Optional - JPEG, PNG - Max 10MB)
                    </Label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("image", e.target.files?.[0] || null)}
                        className="hidden"
                        id="image-upload"
                        disabled={submitting}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-white">{imageFile ? imageFile.name : "Click to upload cover image"}</p>
                        <p className="text-gray-400 text-sm">JPEG, PNG up to 10MB</p>
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Track...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Track
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
