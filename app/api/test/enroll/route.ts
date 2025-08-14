import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
import { Lesson } from '@/lib/models/lesson'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get user email and course ID from request body
    const { userEmail, courseId } = await request.json()

    if (!userEmail || !courseId) {
      return NextResponse.json({ 
        error: 'User email and course ID are required' 
      }, { status: 400 })
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail.toLowerCase() })
    if (!user) {
      return NextResponse.json({ 
        error: `User with email ${userEmail} not found` 
      }, { status: 404 })
    }

    // Find the course by ID
    let course = await Course.findById(courseId)
    
    // If course not found and courseId is 'test-course', create a test course
    if (!course && courseId === 'test-course') {
      console.log('Creating test course...')
      
      const testCourseData = {
        title: 'Тест хичээл - Test Course',
        description: 'Энэ бол тестийн зорилгоор үүсгэгдсэн хичээл юм. This is a test course created for testing purposes.',
        thumbnail: '/placeholder.svg',
        price: 0, // Free
        duration: 30, // 30 minutes
        category: 'other',
        level: 'beginner',
        language: 'mongolian',
        instructor: 'Test Instructor',
        requirements: ['Баз мэдлэг Basic knowledge'],
        whatYouWillLearn: ['Тестийн зорилгоор сурах Learn for testing purposes'],
        published: true,
        status: 'active',
        studentsCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      course = await Course.create(testCourseData)
      console.log('Created test course:', course.title)
      
      // Create a test lesson for the course with a proper bunny.net video URL
      // For testing purposes, we'll use a sample bunny.net video ID
      const testLessonData = {
        title: 'Тест хичээл 1 - Test Lesson 1',
        description: 'Энэ бол тестийн хичээл юм. This is a test lesson.',
        videoUrl: 'bunny:test-video-123', // Use bunny: prefix format that video player expects
        duration: 15, // 15 minutes
        order: 1,
        course: course._id,
        preview: true, // Make it previewable
        createdAt: new Date()
      }
      
      const testLesson = await Lesson.create(testLessonData)
      console.log('Created test lesson:', testLesson.title)
      
      // Add the lesson to the course
      await Course.findByIdAndUpdate(course._id, {
        $push: { lessons: testLesson._id }
      })
    } else if (!course) {
      return NextResponse.json({ 
        error: `Course with ID ${courseId} not found` 
      }, { status: 404 })
    }

    // Check if already enrolled
    const isAlreadyEnrolled = user.enrolledCourses?.some((id: any) => id.toString() === course._id.toString())
    if (isAlreadyEnrolled) {
      return NextResponse.json({ 
        message: 'User is already enrolled in this course',
        enrolled: true 
      })
    }

    // Enroll user in course
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { enrolledCourses: course._id }
    })

    // Increment course studentsCount
    await Course.findByIdAndUpdate(course._id, {
      $inc: { studentsCount: 1 }
    })

    console.log(`User ${user._id} (${userEmail}) enrolled in course ${course._id} (${course.title})`)

    return NextResponse.json({
      message: 'User enrolled successfully',
      enrolled: true,
      courseId: course._id,
      courseTitle: course.title,
      userId: user._id,
      userEmail: user.email
    })

  } catch (error) {
    console.error('Test enrollment error:', error)
    return NextResponse.json({ 
      error: 'Enrollment failed',
      details: String(error)
    }, { status: 500 })
  }
}
