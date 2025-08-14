import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Course } from '@/lib/models/course'
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

    // Only admins can create lessons
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Зөвхөн админ хэрэглэгч хичээл үүсгэх боломжтой' },
        { status: 403 }
      )
    }

    const requestData = await request.json()
    const { title, description, videoUrl, duration, order, courseId, preview = false } = requestData
    
    console.log(`📝 Creating lesson with data:`, requestData)
    console.log(`🎥 Video URL for new lesson:`, videoUrl)

    // Validate required fields
    if (!title || !description || !videoUrl || !duration || !order || !courseId) {
      console.log(`❌ Missing required fields:`, { title: !!title, description: !!description, videoUrl: !!videoUrl, duration: !!duration, order: !!order, courseId: !!courseId })
      return NextResponse.json(
        { error: 'Бүх талбарууд шаардлагатай' },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    // Create the lesson
    const lessonData = {
      title,
      description,
      videoUrl,
      duration: Number(duration),
      order: Number(order),
      course: courseId,
      preview: Boolean(preview)
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
