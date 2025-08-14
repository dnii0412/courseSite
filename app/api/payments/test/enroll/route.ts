import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID шаардлагатай' }, { status: 400 })
    }

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })
    }

    // Check if user is already enrolled
    const currentUser = await User.findById(user.userId)
    if (!currentUser) {
      return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 })
    }

    const isAlreadyEnrolled = currentUser.enrolledCourses?.some(
      (courseId: any) => courseId.toString() === courseId
    )

    if (isAlreadyEnrolled) {
      return NextResponse.json({ 
        message: 'Хэрэглэгч энэ хичээлд аль хэдийн бүртгэгдсэн байна',
        enrolled: true 
      })
    }

    // Enroll user in course
    await User.findByIdAndUpdate(user.userId, {
      $addToSet: { enrolledCourses: courseId }
    })

    // Increment course studentsCount
    await Course.findByIdAndUpdate(courseId, {
      $inc: { studentsCount: 1 }
    })

    console.log(`User ${user.userId} enrolled in course ${courseId}`)

    return NextResponse.json({
      message: 'Хэрэглэгч амжилттай бүртгэгдлээ',
      enrolled: true,
      courseId,
      userId: user.userId
    })

  } catch (error) {
    console.error('Test enrollment error:', error)
    return NextResponse.json({ 
      error: 'Бүртгэл хийхэд алдаа гарлаа',
      details: String(error)
    }, { status: 500 })
  }
}
