import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { verify } from 'jsonwebtoken'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB()
    
    // Check authentication - try NextAuth first, then custom admin session
    let userId: string | null = null
    
    // Try NextAuth session
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      userId = session.user.id
    }
    
    // If no NextAuth session, try custom admin session
    if (!userId) {
      const adminSession = request.cookies.get('admin-session')?.value
      if (adminSession) {
        try {
          const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
          if (decoded?.isAdmin) {
            userId = decoded.userId
          }
        } catch (error) {
          console.error('Error verifying admin session:', error)
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Single source of truth: user's enrolledCourses array
    const userDoc = (await User.findById(userId).select('enrolledCourses').lean()) as any
    console.log(`🔍 Checking enrollment for user ${userId} in course ${courseId}`)
    console.log(`👤 User document:`, userDoc)
    console.log(`📚 User's enrolledCourses:`, userDoc?.enrolledCourses)
    
    // Step 1: Check if user has enrolledCourses array
    if (!userDoc?.enrolledCourses || !Array.isArray(userDoc.enrolledCourses)) {
      console.log(`❌ User has no enrolledCourses array or it's not an array`)
      return NextResponse.json({ enrolled: false }, { headers: { 'Cache-Control': 'no-store' } })
    }
    
    // Step 2: Check if enrolledCourses array is empty
    if (userDoc.enrolledCourses.length === 0) {
      console.log(`❌ User's enrolledCourses array is empty`)
      return NextResponse.json({ enrolled: false }, { headers: { 'Cache-Control': 'no-store' } })
    }
    
    // Step 3: Check if the courseId exists in enrolledCourses array
    const isEnrolled = userDoc.enrolledCourses.some((courseRef: any) => {
      if (!courseRef) return false
      
      // Handle different possible formats of course references
      let courseIdString: string
      
      if (typeof courseRef === 'object' && courseRef._id) {
        courseIdString = courseRef._id.toString()
      } else if (typeof courseRef === 'string') {
        courseIdString = courseRef
      } else if (typeof courseRef.toString === 'function') {
        courseIdString = courseRef.toString()
      } else {
        return false
      }
      
      return courseIdString === courseId
    })
    
    console.log(`✅ User enrolled in course: ${isEnrolled}`)
    console.log(`📋 Course ${courseId} found in enrolledCourses: ${isEnrolled}`)

    return NextResponse.json(
      isEnrolled
        ? { enrolled: true, enrollment: { _id: null, progress: 0, completedLessons: [], enrolledAt: null } }
        : { enrolled: false },
      { headers: { 'Cache-Control': 'no-store' } }
    )

  } catch (error) {
    console.error('Enrollment check error:', error)
    return NextResponse.json(
      { error: 'Бүртгэл шалгахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
