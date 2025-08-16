'use client'

import { useMemo } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  courseId: string
  lessonId: string
}

export function VideoPlayer({ videoUrl, title, courseId, lessonId }: VideoPlayerProps) {
  const bunnyEmbed = useMemo(() => {
    const lib = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
    console.log('🎬 VideoPlayer Debug:', { videoUrl, lib, courseId, lessonId })
    
    if (!lib) {
      console.log('❌ No NEXT_PUBLIC_BUNNY_LIBRARY_ID found')
      return null
    }
    
    const raw = String(videoUrl || '').trim()
    console.log('🔗 Raw video URL:', raw)
    
    // If it's already a Bunny.net embed URL, use it directly
    if (raw.includes('iframe.mediadelivery.net/embed/')) {
      console.log('✅ Using direct Bunny.net embed URL')
      return raw
    }
    
    // Extract video ID from various URL formats
    const idFromPrefix = raw.match(/^bunny:([^/?#]+)/)?.[1]
    const idFromPlay = raw.match(/\/play\/[^\/?#]+\/([^\/?#]+)/)?.[1]
    const idFromEmbed = raw.match(/\/embed\/[^\/?#]+\/([^\/?#]+)/)?.[1]
    const id = idFromPrefix || idFromPlay || idFromEmbed
    
    console.log('🆔 Extracted video ID:', id)
    
    if (!id) {
      console.log('❌ Could not extract video ID from URL')
      return null
    }
    
    const embedUrl = `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=false`
    console.log('🎥 Generated embed URL:', embedUrl)
    return embedUrl
  }, [videoUrl, courseId, lessonId])

  console.log('🎬 Final bunnyEmbed value:', bunnyEmbed)

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
  console.log('🔄 Falling back to raw video element with URL:', videoUrl)
  return (
    <div className="relative bg-black">
      <video src={videoUrl} className="w-full aspect-video" controls />
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
        <h2 className="text-white text-lg font-medium">{title}</h2>
      </div>
    </div>
  )
}
