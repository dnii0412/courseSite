'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  courseId: string
  lessonId: string
}

export function VideoPlayer({ videoUrl, title, courseId, lessonId }: VideoPlayerProps) {
  // Bunny.net embed support: if `videoUrl` is a Bunny embed URL or formatted as `bunny:VIDEO_ID`,
  // render the Bunny iframe player instead of native <video>.
  const isBunnyEmbedUrl = typeof videoUrl === 'string' && videoUrl.includes('iframe.mediadelivery.net/embed/')
  const isBunnyAnyUrl = typeof videoUrl === 'string' && videoUrl.includes('mediadelivery.net')
  const isBunnyId = typeof videoUrl === 'string' && videoUrl.startsWith('bunny:')
  const bunnyLibraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
  const bunnyVideoId = isBunnyId ? videoUrl.replace(/^bunny:/, '') : null
  const bunnySrc = isBunnyEmbedUrl
    ? videoUrl
    : (isBunnyId && bunnyLibraryId)
      ? undefined
      : null
  const [signedSrc, setSignedSrc] = useState<string | null>(null)

  useEffect(() => {
    const sign = async () => {
      try {
        if (isBunnyId && bunnyLibraryId && bunnyVideoId) {
          const res = await fetch(`/api/bunny/sign?videoId=${encodeURIComponent(bunnyVideoId)}`, { cache: 'no-store' })
          const data = await res.json()
          setSignedSrc(res.ok && data.src ? data.src : null)
          return
        }
        if (isBunnyAnyUrl) {
          // Extract from either /embed/{lib}/{videoId} or /play/{lib}/{videoId}
          const match = videoUrl.match(/\/(?:embed|play)\/([^/]+)\/([^/?#]+)/)
          const lib = match?.[1]
          const vid = match?.[2]
          if (vid) {
            // Prefer provided library id in URL, fallback to env
            const res = await fetch(`/api/bunny/sign?videoId=${encodeURIComponent(vid)}`, { cache: 'no-store' })
            const data = await res.json()
            setSignedSrc(res.ok && data.src ? data.src : null)
            return
          }
        }
      } catch {
        // ignore
      }
      setSignedSrc(null)
    }
    sign()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, isBunnyId, isBunnyEmbedUrl, isBunnyAnyUrl, bunnyLibraryId, bunnyVideoId])

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Bunny iframe player branch
  if (signedSrc || bunnySrc) {
    return (
      <div className="relative bg-black">
        <iframe
          src={signedSrc || bunnySrc!}
          className="w-full aspect-video"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <h2 className="text-white text-lg font-medium">{title}</h2>
        </div>
      </div>
    )
  }

  // Native video fallback
  return (
    <div className="relative bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg.white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
              />
            </div>
            <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
        <h2 className="text-white text-lg font-medium">{title}</h2>
      </div>
    </div>
  )
}
