import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'

export async function POST(request: NextRequest) {
  try {
    const { lessonId } = await request.json()
    
    if (!lessonId) {
      return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })
    }

    await connectDB()
    
    // Find the lesson
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    if (!lesson.videoId) {
      return NextResponse.json({ error: 'No video ID found for lesson' }, { status: 400 })
    }

    // Check video status on Bunny.net
    const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID
    const API_KEY = process.env.BUNNY_STREAM_API_KEY

    if (!LIBRARY_ID || !API_KEY) {
      return NextResponse.json({ error: 'Bunny.net credentials missing' }, { status: 500 })
    }

    const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${lesson.videoId}`, {
      headers: {
        'AccessKey': API_KEY,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch video status',
        status: response.status
      }, { status: response.status })
    }

    const videoData = await response.json()
    const videoStatus = videoData.status || 'unknown'
    
    // Update lesson if video is ready
    if (videoStatus === 'ready' || videoStatus === 'uploaded') {
      const updatedLesson = await Lesson.findByIdAndUpdate(
        lessonId,
        { 
          videoStatus: 'uploaded',
          videoUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${lesson.videoId}`,
          updatedAt: new Date()
        },
        { new: true }
      )
      
      return NextResponse.json({
        success: true,
        videoStatus: 'uploaded',
        videoUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${lesson.videoId}`,
        lesson: updatedLesson
      })
    }

    return NextResponse.json({
      success: true,
      videoStatus,
      data: videoData
    })

  } catch (error) {
    console.error('Status polling error:', error)
    return NextResponse.json({ 
      error: 'Status polling failed',
      details: String(error)
    }, { status: 500 })
  }
}
