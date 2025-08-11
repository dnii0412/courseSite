import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'

// Enrollment tracking was removed. This endpoint now returns success without persisting progress.
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 })
    }

    const { courseId, lessonId } = await request.json()
    if (!courseId || !lessonId) {
      return NextResponse.json({ error: 'Хичээл болон курсын ID шаардлагатай' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Хичээл амжилттай дууслаа',
      progress: 0,
      completedLessons: []
    })
  } catch (error) {
    console.error('Complete lesson (no-op) error:', error)
    return NextResponse.json({ error: 'Хичээл дуусгахад алдаа гарлаа' }, { status: 500 })
  }
}
