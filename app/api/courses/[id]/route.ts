import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'
import '@/lib/models/lesson'
import { User } from '@/lib/models/user'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Буруу ID' }, { status: 400 })
    }

    const course = await Course.findById(params.id)
      .populate('lessons')
      .lean()

    if (!course) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    // Users who have this course in their profile
    const userDocs = await User.find({ enrolledCourses: params.id })
      .select('name email _id')
      .lean()

    const enrollments = userDocs.map((u: any) => ({ user: { _id: u._id, name: u.name, email: u.email } }))

    return NextResponse.json({ course, enrollments })
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа', details: process.env.NODE_ENV !== 'production' ? String((error as any)?.message || error) : undefined },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const courseData = await request.json()
    const course = await Course.findByIdAndUpdate(
      params.id,
      courseData,
      { new: true }
    )

    if (!course) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const course = await Course.findByIdAndDelete(params.id)

    if (!course) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Хичээл амжилттай устгагдлаа' })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
