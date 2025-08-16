import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { User } from '@/lib/models/user'
import { verify } from 'jsonwebtoken'

// Helper function to check admin authentication
async function checkAdminAuth(request: NextRequest) {
  try {
    // First check NextAuth session
    const session = await getServerSession(authOptions)
    if (session?.user) {
      const user = await User.findById(session.user.id).select('role')
      if (user?.role === 'admin') {
        return { isAdmin: true, userId: session.user.id }
      }
    }
    
    // Check custom admin session if NextAuth failed
    const adminSession = request.cookies.get('admin-session')?.value
    if (adminSession) {
      try {
        const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
        if (decoded?.isAdmin) {
          return { isAdmin: true, userId: decoded.userId }
        }
      } catch (error) {
        console.error('Error verifying admin session:', error)
      }
    }
    
    return { isAdmin: false, userId: null }
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return { isAdmin: false, userId: null }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // Check admin authentication
    const { isAdmin } = await checkAdminAuth(request)
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Зөвхөн админ хэрэглэгч хичээл засах боломжтой' },
        { status: 403 }
      )
    }

    const { id } = params
    const updateData = await request.json()
    
    console.log(`🔄 Updating lesson ${id} with data:`, updateData)
    console.log(`🎥 Video URL in update data:`, updateData.videoUrl)

    // Find and update the lesson
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!lesson) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    console.log(`✅ Lesson updated successfully:`, {
      id: lesson._id,
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      description: lesson.description
    })

    return NextResponse.json({
      message: 'Хичээл амжилттай шинэчлэгдлээ',
      lesson
    })

  } catch (error) {
    console.error('Update lesson error:', error)
    return NextResponse.json(
      { error: 'Хичээл шинэчлэхэд алдаа гарлаа' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // Check admin authentication
    const { isAdmin } = await checkAdminAuth(request)
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Зөвхөн админ хэрэглэгч хичээл устгах боломжтой' },
        { status: 403 }
      )
    }

    const { id } = params

    // Find the lesson to get courseId
    const lesson = await Lesson.findById(id)
    if (!lesson) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(id)

    // Remove the lesson from the course
    await Lesson.updateMany(
      { course: lesson.course },
      { $pull: { lessons: id } }
    )

    console.log(`Lesson deleted: ${lesson.title}`)

    return NextResponse.json({
      message: 'Хичээл амжилттай устгагдлаа'
    })

  } catch (error) {
    console.error('Delete lesson error:', error)
    return NextResponse.json(
      { error: 'Хичээл устгахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}


