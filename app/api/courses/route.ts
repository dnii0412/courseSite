import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const all = url.searchParams.get('all') === 'true'
    const filter = all ? {} : { published: true }
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const courseData = await request.json()
    const course = await Course.create(courseData)

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
