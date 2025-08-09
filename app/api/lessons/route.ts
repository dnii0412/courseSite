import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { title, duration, courseId, videoUrl, description, preview } = await request.json()
    if (!title || !duration || !courseId || !videoUrl) {
      return NextResponse.json({ error: 'Талбар дутуу' }, { status: 400 })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })
    }

    const lesson = await Lesson.create({ 
      title, 
      duration, 
      course: courseId, 
      order: Date.now(), 
      videoUrl, 
      description: (typeof description === 'string' && description.trim().length > 0) ? description : 'Тайлбаргүй',
      preview: Boolean(preview)
    })
    await Course.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } })
    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Create lesson error:', error)
    const message = error instanceof Error ? error.message : 'Хичээл үүсгэхэд алдаа'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
