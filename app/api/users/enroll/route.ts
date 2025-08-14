import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get session using NextAuth
    const session = await getServerSession(authOptions) as any
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 })
    }

    const { courseId } = await request.json()
    if (!courseId) {
      return NextResponse.json({ error: 'courseId шаардлагатай' }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 })
    }

    // Check if already enrolled
    if (user.enrolledCourses && user.enrolledCourses.includes(courseId)) {
      return NextResponse.json({ error: 'Та энэ хичээлд бүртгүүлсэн байна' }, { status: 409 })
    }

    // Add course to enrolled courses
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { enrolledCourses: courseId }
    })

    return NextResponse.json({
      message: 'Хичээлд амжилттай бүртгүүллээ',
      courseId,
      userId: user._id
    })
  } catch (error) {
    console.error('Enroll save error:', error)
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
