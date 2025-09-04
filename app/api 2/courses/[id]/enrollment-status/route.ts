import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { Database } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        isEnrolled: false, 
        isAuthenticated: false,
        message: "User not authenticated" 
      })
    }

    const { id } = await params
    const courseId = new ObjectId(id)
    const userId = new ObjectId(session.user.id)

    const db = Database.getInstance()
    
    // Check if user is enrolled in this course
    const enrollment = await db.getEnrollment(userId, courseId)
    
    return NextResponse.json({ 
      isEnrolled: !!enrollment,
      isAuthenticated: true,
      enrollment: enrollment || null
    })
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    return NextResponse.json({ 
      isEnrolled: false, 
      isAuthenticated: false,
      error: "Failed to check enrollment status" 
    }, { status: 500 })
  }
}
