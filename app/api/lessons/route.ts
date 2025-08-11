import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { title, duration, courseId } = body || {}
    let { videoUrl, description } = body || {}

    if (!title || !duration || !courseId) {
      return NextResponse.json({ error: 'Талбар дутуу' }, { status: 400 })
    }

    // Normalize Bunny video input to bunny:VIDEO_ID
    const raw = String(videoUrl || '').trim()
    const idFromPlay = raw.match(/\/play\/[^/]+\/([^/?#]+)/)?.[1]
    const idFromEmbed = raw.match(/\/embed\/[^/]+\/([^/?#]+)/)?.[1]
    const idFromPrefix = raw.match(/^bunny:([^/?#]+)/)?.[1]
    const looksLikeGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw)
    const bunnyId = idFromPlay || idFromEmbed || idFromPrefix || (looksLikeGuid ? raw : '')
    const normalizedVideo = bunnyId ? `bunny:${bunnyId}` : raw

    if (!normalizedVideo) {
      return NextResponse.json({ error: 'Видео линк шаардлагатай' }, { status: 400 })
    }

    description = (description && String(description).trim()) || 'Видео хичээл'

    const lesson = await Lesson.create({
      title,
      duration,
      course: courseId,
      order: Date.now(),
      videoUrl: normalizedVideo,
      description,
    })
    await Course.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } })
    return NextResponse.json(lesson, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Хичээл үүсгэхэд алдаа', details: String(error?.message || error) }, { status: 500 })
  }
}
