"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl?: string
  title: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  courseId?: string
  requireAuth?: boolean
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  className = "",
  autoplay = false,
  muted = true,
  courseId,
  requireAuth = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { data: session, status } = useSession()

  // Check enrollment status when component mounts or session changes
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!requireAuth || !courseId || !session?.user?.id) {
        setIsEnrolled(!requireAuth) // If no auth required, allow access
        return
      }

      setCheckingEnrollment(true)
      try {
        const response = await fetch(`/api/courses/${courseId}/enrollment-status`)
        const data = await response.json()
        setIsEnrolled(data.isEnrolled)
      } catch (error) {
        console.error("Error checking enrollment:", error)
        setIsEnrolled(false)
      } finally {
        setCheckingEnrollment(false)
      }
    }

    checkEnrollment()
  }, [session, courseId, requireAuth])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    // Check authentication and enrollment if required
    if (requireAuth) {
      if (status === "loading" || checkingEnrollment) {
        return // Wait for auth check to complete
      }

      if (!session?.user?.id) {
        // Redirect to login
        window.location.href = "/login"
        return
      }

      if (!isEnrolled) {
        // Show enrollment message or redirect to course page
        alert("Та энэ хичээлд бүртгүүлэх шаардлагатай. (You need to enroll in this course to watch the video.)")
        return
      }
    }

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleRestart = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`relative bg-black rounded-lg sm:rounded-xl aspect-video overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-cover"
        preload="metadata"
        autoPlay={autoplay}
        muted={isMuted}
        playsInline
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Authentication/Enrollment Lock Overlay */}
      {requireAuth && (!session?.user?.id || !isEnrolled) && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-6">
          <Lock className="w-16 h-16 mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            {!session?.user?.id ? "Нэвтрэх шаардлагатай" : "Бүртгүүлэх шаардлагатай"}
          </h3>
          <p className="text-center text-gray-300 mb-4">
            {!session?.user?.id
              ? "Видео үзэхийн тулд эхлээд нэвтэрнэ үү"
              : "Энэ хичээлийн видеог үзэхийн тулд бүртгүүлнэ үү"
            }
          </p>
          <Button
            onClick={() => {
              if (!session?.user?.id) {
                window.location.href = "/login"
              } else {
                window.location.href = `/courses/${courseId}`
              }
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {!session?.user?.id ? "Нэвтрэх" : "Хичээлд бүртгүүлэх"}
          </Button>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && (!requireAuth || (session?.user?.id && isEnrolled)) && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            size="lg"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 rounded-full w-16 h-16"
            disabled={checkingEnrollment}
          >
            {checkingEnrollment ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={togglePlay}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Button
                onClick={toggleMute}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <Button
                onClick={handleRestart}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <Button
              onClick={handleFullscreen}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
