import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'
import { User } from '@/lib/models/user'
import { verify } from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Check admin authentication
    let isAdmin = false
    let userId = null
    
    console.log('🔐 Checking authentication...')
    
    // First check NextAuth session
    const session = await getServerSession(authOptions)
    console.log('📱 NextAuth session:', session ? 'exists' : 'none')
    
    if (session?.user) {
      console.log('👤 User ID from session:', session.user.id)
      const user = await User.findById(session.user.id).select('role')
      console.log('👑 User role:', user?.role)
      if (user?.role === 'ADMIN') {
        isAdmin = true
        userId = session.user.id
        console.log('✅ Admin authenticated via NextAuth')
      }
    }
    
    // Check custom admin session if NextAuth failed
    if (!isAdmin) {
      const adminSession = request.cookies.get('admin-session')?.value
      console.log('🍪 Admin session cookie:', adminSession ? 'exists' : 'none')
      
      if (adminSession) {
        try {
          const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
          console.log('🔓 Decoded admin session:', decoded)
          if (decoded?.isAdmin) {
            isAdmin = true
            userId = decoded.userId
            console.log('✅ Admin authenticated via custom session')
          }
        } catch (error) {
          console.error('❌ Error verifying admin session:', error)
        }
      }
    }
    
    console.log('🎯 Final auth result:', { isAdmin, userId })
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Зөвхөн админ хэрэглэгч хичээл үүсгэх боломжтой' },
        { status: 403 }
      )
    }

    const requestData = await request.json()
    const { title, description = '', videoUrl, duration, order, courseId, preview = false, videoFile } = requestData
    
    console.log(`📝 Creating lesson with data:`, requestData)
    console.log(`🎥 Video URL for new lesson:`, videoUrl)
    console.log(`🔍 Course ID:`, courseId, `Type:`, typeof courseId)

    // Validate required fields (videoUrl is optional for initial creation)
    if (!title || !duration || !courseId) {
      console.log(`❌ Missing required fields:`, { title: !!title, duration: !!duration, courseId: !!courseId })
      return NextResponse.json(
        { error: 'Гарчиг, үргэлжлэх хугацаа, хичээл шаардлагатай' },
        { status: 400 }
      )
    }

    // Check if course exists
    console.log('🔍 Looking for course with ID:', courseId)
    console.log('🔍 Course ID type:', typeof courseId)
    
    // Try to find course with different ID formats
    let course = await Course.findById(courseId)
    
    if (!course && courseId && courseId.length === 24) {
      // Try with ObjectId conversion
      try {
        const { ObjectId } = require('mongodb')
        course = await Course.findById(new ObjectId(courseId))
        console.log('🔄 Tried ObjectId conversion, result:', course ? 'found' : 'not found')
      } catch (error) {
        console.log('❌ ObjectId conversion failed:', error)
      }
    }
    
    console.log('📚 Course found:', course ? 'yes' : 'no')
    
    if (!course) {
      console.log('❌ Course not found with ID:', courseId)
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }
    
    console.log('✅ Course found:', course.title)

    // Create the lesson
    const lessonData = {
      title,
      description,
      videoUrl: videoUrl || null,
      duration: Number(duration),
      order: order ? Number(order) : 0,
      course: courseId,
      preview: Boolean(preview),
      videoFile: videoFile || null,
      videoStatus: videoUrl ? 'uploaded' : 'pending'
    }
    
    console.log(`💾 Saving lesson data to database:`, lessonData)
    
    const lesson = await Lesson.create(lessonData)
    
    console.log(`✅ Lesson saved to database:`, {
      id: lesson._id,
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      course: lesson.course
    })

    // Add the lesson to the course
    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id }
    })

    console.log(`Lesson created: ${lesson.title} for course: ${course.title}`)

    return NextResponse.json({
      message: 'Хичээл амжилттай үүсгэгдлээ',
      lesson
    })

  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json(
      { error: 'Хичээл үүсгэхэд алдаа гарлаа' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Хичээлийн ID шаардлагатай' },
        { status: 400 }
      )
    }

    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1 })
      .lean()

    return NextResponse.json({ lessons })

  } catch (error) {
    console.error('Get lessons error:', error)
    return NextResponse.json(
      { error: 'Хичээлүүд авахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
