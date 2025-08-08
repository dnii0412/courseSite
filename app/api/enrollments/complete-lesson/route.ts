import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Enrollment } from '@/lib/models/enrollment'
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

    const { courseId, lessonId } = await request.json()

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: 'Хичээл болон курсын ID шаардлагатай' },
        { status: 400 }
      )
    }

    // Find enrollment for this user and course
    const enrollment = await Enrollment.findOne({
      user: user.userId,
      course: courseId
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Бүртгэл олдсонгүй' },
        { status: 404 }
      )
    }

    // Check if lesson is already completed
    const isAlreadyCompleted = enrollment.completedLessons?.some(
      (completed: any) => completed.lesson?.toString() === lessonId
    )

    if (!isAlreadyCompleted) {
      // Add lesson to completed lessons
      enrollment.completedLessons.push({
        lesson: lessonId,
        completedAt: new Date()
      })

      // Update progress
      const totalLessons = enrollment.course.lessons?.length || 0
      const completedCount = enrollment.completedLessons.length
      enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      await enrollment.save()
    }

    return NextResponse.json({
      message: 'Хичээл амжилттай дууслаа',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    })

  } catch (error) {
    console.error('Complete lesson error:', error)
    return NextResponse.json(
      { error: 'Хичээл дуусгахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
