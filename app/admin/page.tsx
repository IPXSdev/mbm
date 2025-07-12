
"use client"

import { useEffect, useState } from "react"
import { getTracks } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music } from "lucide-react"

export default function AdminDashboard() {
  const [tracks, setTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchTracks() {
      try {
        const data = await getTracks()
        setTracks(data)
      } catch (err: any) {
        setError("Failed to load submissions.")
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Music className="h-8 w-8 animate-pulse mx-auto mb-4" />
        <p className="text-white">Loading submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-red-500/20 border-red-500/50">
        <AlertDescription className="text-white">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Platform Uploads</h1>
      {tracks.length === 0 ? (
        <p className="text-gray-300">No submissions yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <Card key={track.id} className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{track.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-2">Artist: {track.artist}</p>
                <p className="text-gray-300 mb-2">Genre: {track.genre}</p>
                <p className="text-gray-400 text-xs mb-2">Submitted: {new Date(track.created_at).toLocaleString()}</p>
                {track.file_url && (
                  <audio controls src={track.file_url} className="w-full mt-2" />
                )}
                {track.image_url && (
                  <img src={track.image_url} alt="Cover" className="w-24 h-24 object-cover rounded mt-2" />
                )}
                <p className="text-gray-400 text-xs mt-2">Status: {track.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
