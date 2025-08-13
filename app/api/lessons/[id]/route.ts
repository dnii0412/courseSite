import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'
import mongoose from 'mongoose'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Буруу ID' }, { status: 400 })
    }

    const body = await request.json()
    const update: any = {}
    if (typeof body.title === 'string') update.title = body.title
    if (typeof body.duration === 'number') update.duration = body.duration
    if (typeof body.preview === 'boolean') update.preview = body.preview
    if (typeof body.description === 'string') update.description = body.description

    const lesson = await Lesson.findByIdAndUpdate(params.id, update, { new: true })
    if (!lesson) {
      return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })
    }
    return NextResponse.json(lesson)
  } catch (error: any) {
    return NextResponse.json({ error: 'Хичээл засахад алдаа', details: String(error?.message || error) }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Буруу ID' }, { status: 400 })
    }

    const lesson = await Lesson.findById(params.id)
    if (!lesson) {
      return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })
    }

    await Lesson.findByIdAndDelete(params.id)
    // Remove from course.lessons array if present
    await Course.findByIdAndUpdate(lesson.course, { $pull: { lessons: lesson._id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Хичээл устгахад алдаа', details: String(error?.message || error) }, { status: 500 })
  }
}


