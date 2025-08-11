'use client'

import { useMemo } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  courseId: string
  lessonId: string
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const bunnyEmbed = useMemo(() => {
    const lib = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
    if (!lib) return null
    const raw = String(videoUrl || '').trim()
    const idFromPrefix = raw.match(/^bunny:([^/?#]+)/)?.[1]
    const idFromPlay = raw.match(/\/play\/[^/]+\/([^/?#]+)/)?.[1]
    const idFromEmbed = raw.match(/\/embed\/[^/]+\/([^/?#]+)/)?.[1]
    const id = idFromPrefix || idFromPlay || idFromEmbed
    if (!id) return null
    return `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=false`
  }, [videoUrl])

  if (bunnyEmbed) {
    return (
      <div className="relative bg-black">
        <iframe
          src={bunnyEmbed}
          className="w-full aspect-video"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <h2 className="text-white text-lg font-medium">{title}</h2>
        </div>
      </div>
    )
  }

  // Fallback: render raw video URL
  return (
    <div className="relative bg-black">
      <video src={videoUrl} className="w-full aspect-video" controls />
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
        <h2 className="text-white text-lg font-medium">{title}</h2>
      </div>
    </div>
  )
}
