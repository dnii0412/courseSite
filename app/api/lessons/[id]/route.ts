import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Only admins can update lessons
    if (user.role !== 'ADMIN') {
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
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    // Only admins can delete lessons
    if (user.role !== 'ADMIN') {
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


