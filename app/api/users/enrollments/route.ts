import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
import { Enrollment } from '@/lib/models/enrollment'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    // Get user enrollments
    const enrollments = await Enrollment.find({ userId: session.user.id })
      .populate('courseId')
      .sort({ createdAt: -1 })

    // Transform the data to match the expected format
    const courses = enrollments.map(enrollment => {
      const course = enrollment.courseId as any
      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        image: course.image,
        category: course.category,
        level: course.level,
        duration: course.duration,
        lessons: course.lessons || 0,
        rating: course.rating || 0,
        enrolledAt: enrollment.createdAt,
        progress: enrollment.progress || 0
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
