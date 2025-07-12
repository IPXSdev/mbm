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
import { supabase } from "@/lib/auth-client"

export default function SubmitPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    email: "",
    description: "",
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

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
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
      const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/m4a", "audio/aac"]
      if (!validTypes.includes(file.type)) {
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please upload a valid image file (JPEG, PNG, WebP)")
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Image file must be less than 10MB")
        return
      }

      setImageFile(file)
      setErrorMessage("")

      // Create preview URL
      const url = URL.createObjectURL(file)
      setImagePreview(url)
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

    if (!formData.title || !formData.artist || !formData.genre || !formData.email) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      // Simulate upload progress
      setUploadProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUploadProgress(50)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUploadProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create track record (mock for now)
      const trackData = {
        id: Date.now().toString(),
        user_id: user.id,
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        email: formData.email,
        description: formData.description,
        file_url: audioPreview || "",
        image_url: imagePreview || null,
        file_name: audioFile.name,
        file_size: audioFile.size,
        status: "pending" as const,
        created_at: new Date().toISOString(),
      }

      // Store in localStorage for demo
      const existingSubmissions = JSON.parse(localStorage.getItem("userSubmissions") || "[]")
      existingSubmissions.push(trackData)
      localStorage.setItem("userSubmissions", JSON.stringify(existingSubmissions))

      setUploadProgress(100)
      setSubmitStatus("success")

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          artist: "",
          genre: "",
          email: user.email || "",
          description: "",
        })
        setAudioFile(null)
        setImageFile(null)
        setAudioPreview(null)
        setImagePreview(null)
        setUploadProgress(0)
        setSubmitStatus("idle")

        // Redirect to dashboard
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Submission error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit track")
      setSubmitStatus("error")
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Submit Your Track</h1>
            <p className="text-xl text-gray-300">
              Share your music with the world. Get discovered by industry professionals.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Track Submission</CardTitle>
              <CardDescription className="text-gray-300">
                Fill out the form below to submit your track for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
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
                        {genres.map((genre) => (
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
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
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
                  />
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  {/* Audio File Upload */}
                  <div className="space-y-2">
                    <Label className="text-white">Audio File *</Label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-white mb-2">{audioFile ? audioFile.name : "Click to upload audio file"}</p>
                        <p className="text-sm text-gray-400">MP3, WAV, M4A, AAC (max 50MB)</p>
                      </label>
                    </div>

                    {audioPreview && (
                      <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={toggleAudioPreview}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-white text-sm">Preview: {audioFile?.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Image File Upload */}
                  <div className="space-y-2">
                    <Label className="text-white">Cover Image (Optional)</Label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-white mb-2">{imageFile ? imageFile.name : "Click to upload cover image"}</p>
                        <p className="text-sm text-gray-400">JPEG, PNG, WebP (max 10MB)</p>
                      </label>
                    </div>

                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Cover preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {isSubmitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Status Messages */}
                {errorMessage && (
                  <Alert className="bg-red-500/20 border-red-500/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-white">{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {submitStatus === "success" && (
                  <Alert className="bg-green-500/20 border-green-500/50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-white">
                      Track submitted successfully! Redirecting to dashboard...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !audioFile}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
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
