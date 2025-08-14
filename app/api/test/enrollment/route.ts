import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'

export async function GET() {
  try {
    await connectDB()

    // Find the test user
    const user = await User.findOne({ email: 'xpdigital.dev@gmail.com' })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find the test course
    const course = await Course.findById('689df1ea1df8cbccc4c564f2')
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check current enrollment
    const isEnrolled = user.enrolledCourses?.some(id => id.toString() === course._id.toString())
    
    // Test the access check logic
    const enrolledIds = (user.enrolledCourses || [])
      .map((entry: any) => {
        if (!entry) return null
        if (typeof entry === 'object') {
          if (entry._id) return entry._id.toString()
          if (typeof entry.toString === 'function') return entry.toString()
          return null
        }
        return entry?.toString?.() || null
      })
      .filter(Boolean)

    const hasAccess = enrolledIds.includes(course._id.toString())

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        enrolledCourses: user.enrolledCourses
      },
      course: {
        id: course._id,
        title: course.title,
        price: course.price
      },
      enrollment: {
        isEnrolled,
        enrolledIds,
        courseId: course._id.toString(),
        hasAccess
      }
    })

  } catch (error) {
    console.error('Test enrollment error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: String(error)
    }, { status: 500 })
  }
}
