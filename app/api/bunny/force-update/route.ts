import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'

export async function POST(request: NextRequest) {
  try {
    const { lessonId, videoId } = await request.json()
    
    if (!lessonId || !videoId) {
      return NextResponse.json({ error: 'Missing lessonId or videoId' }, { status: 400 })
    }

    await connectDB()
    
    // Find the lesson
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Check video status on Bunny.net
    const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID
    const API_KEY = process.env.BUNNY_STREAM_API_KEY

    if (!LIBRARY_ID || !API_KEY) {
      return NextResponse.json({ error: 'Bunny.net credentials missing' }, { status: 500 })
    }

    const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
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
    console.log('🎬 Video data from Bunny.net:', JSON.stringify(videoData, null, 2))
    
    // Force update lesson regardless of status
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { 
        videoId: videoId,
        videoStatus: 'uploaded',
        videoUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`,
        updatedAt: new Date()
      },
      { new: true }
    )
    
    return NextResponse.json({
      success: true,
      message: 'Lesson force-updated successfully',
      videoStatus: 'uploaded',
      videoUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`,
      lesson: updatedLesson,
      bunnyVideoData: videoData
    })

  } catch (error) {
    console.error('Force update error:', error)
    return NextResponse.json({ 
      error: 'Force update failed',
      details: String(error)
    }, { status: 500 })
  }
}
