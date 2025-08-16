import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subcourse } from '@/lib/models/subcourse'
import { Course } from '@/lib/models/course'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const subcourse = await Subcourse.findById(params.id)
      .populate('course', 'title')
    
    if (!subcourse) {
      return NextResponse.json(
        { error: 'Subcourse not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(subcourse)
  } catch (error) {
    console.error('Error fetching subcourse:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcourse' },
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
    
    const subcourse = await Subcourse.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )
    
    if (!subcourse) {
      return NextResponse.json(
        { error: 'Subcourse not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(subcourse)
  } catch (error) {
    console.error('Error updating subcourse:', error)
    return NextResponse.json(
      { error: 'Failed to update subcourse' },
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
    
    const subcourse = await Subcourse.findById(params.id)
    if (!subcourse) {
      return NextResponse.json(
        { error: 'Subcourse not found' },
        { status: 404 }
      )
    }
    
    // Remove subcourse from course
    await Course.findByIdAndUpdate(
      subcourse.course,
      { $pull: { subcourses: params.id } }
    )
    
    // Delete the subcourse
    await Subcourse.findByIdAndDelete(params.id)
    
    return NextResponse.json({ message: 'Subcourse deleted successfully' })
  } catch (error) {
    console.error('Error deleting subcourse:', error)
    return NextResponse.json(
      { error: 'Failed to delete subcourse' },
      { status: 500 }
    )
  }
}
