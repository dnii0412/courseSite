import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 })
    }

    const { courseId } = await request.json()
    if (!courseId) {
      return NextResponse.json({ error: 'courseId шаардлагатай' }, { status: 400 })
    }

    await User.findByIdAndUpdate(user.userId, {
      $addToSet: { enrolledCourses: courseId }
    })

    return NextResponse.json({ message: 'Enrolled course saved on user', courseId })
  } catch (error) {
    console.error('Enroll save error:', error)
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
