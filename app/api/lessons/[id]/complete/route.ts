import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    
    const { completed } = await request.json()
    
    const lesson = await Lesson.findByIdAndUpdate(
      params.id,
      { 
        isCompleted: completed,
        completedAt: completed ? new Date() : null
      },
      { new: true }
    )
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: lesson 
    })
  } catch (error) {
    console.error('Error updating lesson completion:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson completion' },
      { status: 500 }
    )
  }
}
