import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subcourse } from '@/lib/models/subcourse'
import { Course } from '@/lib/models/course'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    
    if (courseId) {
      const subcourses = await Subcourse.find({ course: courseId })
        .populate('lessons', 'title description duration order preview videoUrl videoId videoStatus')
        .sort({ order: 1 })
      return NextResponse.json(subcourses)
    }
    
    const subcourses = await Subcourse.find()
      .populate('course', 'title')
      .sort({ order: 1 })
    return NextResponse.json(subcourses)
  } catch (error) {
    console.error('Error fetching subcourses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcourses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const { courseId, ...subcourseData } = body
    
    // Create the subcourse
    const subcourse = new Subcourse({
      ...subcourseData,
      course: courseId
    })
    
    await subcourse.save()
    
    // Add subcourse to course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { subcourses: subcourse._id } }
    )
    
    return NextResponse.json(subcourse, { status: 201 })
  } catch (error) {
    console.error('Error creating subcourse:', error)
    return NextResponse.json(
      { error: 'Failed to create subcourse' },
      { status: 500 }
    )
  }
}
