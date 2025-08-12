import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Single source of truth: user's enrolledCourses
    const userDoc = (await User.findById(user.userId).select('enrolledCourses').lean()) as any
    const isInUserDoc = userDoc?.enrolledCourses?.some((c: any) => c?.toString() === courseId)

    return NextResponse.json(
      isInUserDoc
        ? { enrolled: true, enrollment: { _id: null, progress: 0, completedLessons: [], enrolledAt: null } }
        : { enrolled: false },
      { headers: { 'Cache-Control': 'no-store' } }
    )

  } catch (error) {
    console.error('Enrollment check error:', error)
    return NextResponse.json(
      { error: 'Бүртгэл шалгахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
