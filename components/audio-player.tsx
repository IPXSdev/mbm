"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import Image from "next/image"

interface AudioPlayerProps {
  track: {
    id: string
    title: string
    artist: string
    file_url: string
    image_url?: string
  }
  onNext?: () => void
  onPrevious?: () => void
  className?: string
}

export function AudioPlayer({ track, onNext, onPrevious, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      if (onNext) onNext()
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [onNext])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0] / 100
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className={`p-4 ${className}`}>
      <audio ref={audioRef} src={track.file_url} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Image
            src={track.image_url || "/placeholder.svg?height=48&width=48"}
            alt={track.title}
            width={48}
            height={48}
            className="rounded-md flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate">{track.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {onPrevious && (
            <Button variant="ghost" size="sm" onClick={onPrevious} aria-label="Previous track">
              <SkipBack className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {onNext && (
            <Button variant="ghost" size="sm" onClick={onNext} aria-label="Next track">
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="flex-1"
            aria-label="Track progress"
          />
          <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-20"
            aria-label="Volume"
          />
        </div>
      </div>
    </Card>
  )
}
