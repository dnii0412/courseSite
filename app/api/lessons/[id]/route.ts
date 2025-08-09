import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params
    const body = await request.json().catch(() => ({}))
    const update: any = {}

    if (typeof body.title === 'string') update.title = body.title
    if (typeof body.description === 'string') update.description = body.description
    if (typeof body.duration === 'number') update.duration = body.duration
    if (typeof body.preview === 'boolean') update.preview = body.preview
    if (typeof body.videoUrl === 'string') update.videoUrl = body.videoUrl

    const lesson = await Lesson.findByIdAndUpdate(id, update, { new: true })
    if (!lesson) return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })
    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Update lesson error:', error)
    const message = error instanceof Error ? error.message : 'Хичээл засахад алдаа'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params
    const lesson = await Lesson.findById(id)
    if (!lesson) return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })

    const courseId = lesson.course
    await Lesson.findByIdAndDelete(id)
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { $pull: { lessons: lesson._id } })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete lesson error:', error)
    const message = error instanceof Error ? error.message : 'Хичээл устгахад алдаа'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


