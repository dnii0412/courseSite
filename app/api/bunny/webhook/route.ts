import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🎬 Bunny.net webhook received:', JSON.stringify(body, null, 2))

    // Handle different webhook events
    const { event, videoId, status, url, metadata, guid } = body
    
    // Bunny.net might send different event names
    const isVideoReady = event === 'video.uploaded' || 
                        event === 'video.ready' || 
                        event === 'video.transcoded' ||
                        event === 'video.processed' ||
                        status === 'ready' ||
                        status === 'uploaded'

    if (isVideoReady) {
      console.log('✅ Video is ready, updating lesson...')
      await connectDB()
      
      // Try multiple ways to find the lesson
      let lesson = null
      
      // Method 1: Find by videoId (guid)
      if (videoId || guid) {
        lesson = await Lesson.findOneAndUpdate(
          { videoId: videoId || guid },
          { 
            videoStatus: 'uploaded',
            videoUrl: url || `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${videoId || guid}`,
            updatedAt: new Date()
          },
          { new: true }
        )
        console.log(`🔍 Method 1 - Found by videoId: ${videoId || guid}`, lesson ? 'SUCCESS' : 'NOT FOUND')
      }

      // Method 2: Find by lessonId from metadata
      if (!lesson && metadata?.lessonId) {
        lesson = await Lesson.findByIdAndUpdate(
          metadata.lessonId,
          { 
            videoId: videoId || guid,
            videoStatus: 'uploaded',
            videoUrl: url || `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${videoId || guid}`,
            updatedAt: new Date()
          },
          { new: true }
        )
        console.log(`🔍 Method 2 - Found by metadata.lessonId: ${metadata.lessonId}`, lesson ? 'SUCCESS' : 'NOT FOUND')
      }

      // Method 3: Search for lessons with pending status and matching videoId
      if (!lesson && (videoId || guid)) {
        lesson = await Lesson.findOneAndUpdate(
          { 
            videoStatus: 'pending',
            $or: [
              { videoId: videoId || guid },
              { videoFile: { $regex: videoId || guid, $options: 'i' } }
            ]
          },
          { 
            videoId: videoId || guid,
            videoStatus: 'uploaded',
            videoUrl: url || `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${videoId || guid}`,
            updatedAt: new Date()
          },
          { new: true }
        )
        console.log(`🔍 Method 3 - Found by pending status search`, lesson ? 'SUCCESS' : 'NOT FOUND')
      }

      if (lesson) {
        console.log(`✅ Lesson ${lesson._id} updated successfully with video URL`)
        console.log(`📹 Video ID: ${videoId || guid}`)
        console.log(`🔗 Video URL: ${url || `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${videoId || guid}`}`)
      } else {
        console.log(`❌ No lesson found for videoId: ${videoId || guid}`)
        console.log(`🔍 Available lessons with pending status:`, await Lesson.find({ videoStatus: 'pending' }).select('_id title videoId videoFile'))
      }
    } else {
      console.log(`⏳ Video not ready yet. Event: ${event}, Status: ${status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
