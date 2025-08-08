import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'
import { Enrollment } from '@/lib/models/enrollment'
import { User } from '@/lib/models/user'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const course = await Course.findById(params.id)
      .populate('instructor', 'name')
      .populate('lessons')

    if (!course) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    // Fetch enrolled users for this course (both sources)
    const enrollmentDocs = await Enrollment.find({ course: params.id })
      .populate('user', 'name email')
      .select('user enrolledAt')
      .lean()

    // Include users who have this course in their user.enrolledCourses (test or admin assign)
    const userDocs = await User.find({ enrolledCourses: params.id })
      .select('name email _id')
      .lean()

    // Merge by userId to avoid duplicates
    const mergedMap = new Map<string, any>()
    for (const e of enrollmentDocs) {
      const u: any = e.user
      if (u?._id) {
        mergedMap.set(String(u._id), { user: { _id: u._id, name: u.name, email: u.email }, enrolledAt: e.enrolledAt })
      }
    }
    for (const u of userDocs) {
      const key = String(u._id)
      if (!mergedMap.has(key)) {
        mergedMap.set(key, { user: { _id: u._id, name: u.name, email: u.email } })
      }
    }

    const enrollments = Array.from(mergedMap.values())

    return NextResponse.json({ course, enrollments })
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
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
