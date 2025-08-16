import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { Subcourse } from '@/lib/models/subcourse'
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
      if (user?.role === 'admin') {
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
    const { title, description = '', videoUrl, duration, order, subcourseId, preview = false, videoFile } = requestData
    
    console.log(`📝 Creating lesson with data:`, requestData)
    console.log(`🎥 Video URL for new lesson:`, videoUrl)
    console.log(`🔍 Subcourse ID:`, subcourseId, `Type:`, typeof subcourseId)

    // Validate required fields (videoUrl is optional for initial creation)
    if (!title || !duration || !subcourseId) {
      console.log(`❌ Missing required fields:`, { title: !!title, duration: !!duration, subcourseId: !!subcourseId })
      return NextResponse.json(
        { error: 'Гарчиг, үргэлжлэх хугацаа, дэд хичээл шаардлагатай' },
        { status: 400 }
      )
    }

    // Check if subcourse exists
    console.log('🔍 Looking for subcourse with ID:', subcourseId)
    console.log('🔍 Subcourse ID type:', typeof subcourseId)
    
    // Try to find subcourse with different ID formats
    let subcourse = await Subcourse.findById(subcourseId)
    
    if (!subcourse && subcourseId && subcourseId.length === 24) {
      // Try with ObjectId conversion
      try {
        const { ObjectId } = require('mongodb')
        subcourse = await Subcourse.findById(new ObjectId(subcourseId))
        console.log('🔄 Tried ObjectId conversion, result:', subcourse ? 'found' : 'not found')
      } catch (error) {
        console.log('❌ ObjectId conversion failed:', error)
      }
    }
    
    console.log('📚 Subcourse found:', subcourse ? 'yes' : 'no')
    
    if (!subcourse) {
      console.log('❌ Subcourse not found with ID:', subcourseId)
      return NextResponse.json(
        { error: 'Дэд хичээл олдсонгүй' },
        { status: 404 }
      )
    }
    
    console.log('✅ Subcourse found:', subcourse.title)

    // Create the lesson
    const lessonData = {
      title,
      description,
      videoUrl: videoUrl || null,
      duration: Number(duration),
      order: order ? Number(order) : 0,
      subcourse: subcourseId,
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
      subcourse: lesson.subcourse
    })

    // Add the lesson to the subcourse
    await Subcourse.findByIdAndUpdate(subcourseId, {
      $push: { lessons: lesson._id }
    })

    console.log(`Lesson created: ${lesson.title} for subcourse: ${subcourse.title}`)

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
    const subcourseId = searchParams.get('subcourseId')
    
    if (!subcourseId) {
      return NextResponse.json(
        { error: 'Дэд хичээлийн ID шаардлагатай' },
        { status: 400 }
      )
    }

    const lessons = await Lesson.find({ subcourse: subcourseId })
      .sort({ order: 1 })
      .lean()

    return NextResponse.json(lessons)

  } catch (error) {
    console.error('Get lessons error:', error)
    return NextResponse.json(
      { error: 'Хичээлүүд авахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
