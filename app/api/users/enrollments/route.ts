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
    
    // Get user's enrolled courses directly from User model
    const user = await User.findById(session.user.id).select('enrolledCourses').lean() as any
    console.log('🔍 User data:', user)
    
    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json([])
    }
    
    if (!user.enrolledCourses || !Array.isArray(user.enrolledCourses) || user.enrolledCourses.length === 0) {
      console.log('❌ No enrolled courses found')
      return NextResponse.json([])
    }
    
    console.log('✅ Found enrolled courses:', user.enrolledCourses)

    // Get course details for each enrolled course
    const courses = []
    for (const courseId of user.enrolledCourses) {
      try {
        const course = await Course.findById(courseId).lean() as any
        if (course) {
          courses.push({
            _id: course._id,
            title: course.title,
            description: course.description,
            price: course.price,
            image: course.image,
            category: course.category,
            level: course.level,
            duration: course.duration,
            lessons: course.lessons?.length || 0,
            rating: course.rating || 0,
            enrolledAt: new Date(), // We don't have this info, so use current date
            progress: 0 // We don't have progress info yet
          })
        }
      } catch (error) {
        console.error(`Error fetching course ${courseId}:`, error)
      }
    }

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
