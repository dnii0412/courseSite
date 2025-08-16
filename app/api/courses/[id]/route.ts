import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'
// Ensure all models are registered before we populate them
import '@/lib/models/user'
import '@/lib/models/subcourse'
import '@/lib/models/lesson'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const course = await Course.findById(params.id)
      .populate({
        path: 'subcourses',
        populate: {
          path: 'lessons',
          select: 'title description duration videoStatus order isCompleted isLocked'
        }
      })
      .lean()
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { 
      title, 
      description, 
      price, 
      category, 
      level, 
      duration, 
      language,
      instructor,
      requirements,
      whatYouWillLearn,
      published,
      status
    } = body

    // Check if course exists
    const existingCourse = await Course.findById(params.id)
    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if title is being changed and if new title already exists
    if (title && title !== existingCourse.title) {
      const duplicateCourse = await Course.findOne({ 
        title: { $regex: new RegExp(`^${title}$`, 'i') },
        _id: { $ne: params.id }
      })
      if (duplicateCourse) {
        return NextResponse.json(
          { success: false, error: 'Course with this title already exists' },
          { status: 409 }
        )
      }
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(level && { level }),
        ...(duration !== undefined && { duration }),
        ...(language && { language }),
        ...(instructor && { instructor }),
        ...(requirements && { requirements }),
        ...(whatYouWillLearn && { whatYouWillLearn }),
        ...(published !== undefined && { published }),
        ...(status && { status })
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({ 
      success: true, 
      data: updatedCourse,
      message: 'Course updated successfully'
    })

  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
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

    // Check if course exists
    const existingCourse = await Course.findById(params.id)
    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // Delete course
    await Course.findByIdAndDelete(params.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Course deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
