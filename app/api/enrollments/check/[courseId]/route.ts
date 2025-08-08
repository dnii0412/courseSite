import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Enrollment } from '@/lib/models/enrollment'
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
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

    if (testMode) {
      // In test mode rely solely on user's enrolledCourses
      const userDoc = (await User.findById(user.userId).select('enrolledCourses').lean()) as any
      const isInUserDoc = userDoc?.enrolledCourses?.some((c: any) => c?.toString() === courseId)
      return NextResponse.json(
        isInUserDoc
          ? { enrolled: true, enrollment: { _id: null, progress: 0, completedLessons: [], enrolledAt: null } }
          : { enrolled: false },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    // Production: check Enrollment first, then fallback to user's enrolledCourses
    const enrollment = await Enrollment.findOne({
      user: user.userId,
      course: courseId
    }).populate('course', 'title lessons')

    if (!enrollment) {
      // Fallback to user.enrolledCourses to support test mode purchases without Enrollment doc
      const userDoc = (await User.findById(user.userId).select('enrolledCourses').lean()) as any
      const isInUserDoc = userDoc?.enrolledCourses?.some((c: any) => c?.toString() === courseId)
      if (isInUserDoc) {
        return NextResponse.json({
          enrolled: true,
          enrollment: {
            _id: null,
            progress: 0,
            completedLessons: [],
            enrolledAt: null
          }
        }, { headers: { 'Cache-Control': 'no-store' } })
      }

      // Not enrolled
      return NextResponse.json({ enrolled: false }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // Calculate progress
    const totalLessons = enrollment.course.lessons?.length || 0
    const completedLessons = enrollment.completedLessons?.length || 0
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return NextResponse.json({
      enrolled: true,
      enrollment: {
        _id: enrollment._id,
        progress,
        completedLessons: enrollment.completedLessons || [],
        enrolledAt: enrollment.enrolledAt
      }
    }, { headers: { 'Cache-Control': 'no-store' } })

  } catch (error) {
    console.error('Enrollment check error:', error)
    return NextResponse.json(
      { error: 'Бүртгэл шалгахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
