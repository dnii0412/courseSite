import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { title, duration, courseId } = await request.json()
    if (!title || !duration || !courseId) {
      return NextResponse.json({ error: 'Талбар дутуу' }, { status: 400 })
    }

    const lesson = await Lesson.create({ title, duration, course: courseId, order: Date.now(), videoUrl: 'https://example.com/video.mp4', description: '' })
    await Course.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } })
    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Хичээл үүсгэхэд алдаа' }, { status: 500 })
  }
}
