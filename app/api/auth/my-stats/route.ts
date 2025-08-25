import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { ObjectId } from "mongodb"

// GET /api/auth/my-stats - Get user-specific stats
export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null
    
    // First try NextAuth.js session
    try {
      const session = await auth()
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch (error) {
      console.log("NextAuth session check failed, trying custom auth")
    }
    
    // If NextAuth failed, try custom auth token
    if (!userId) {
      const token = request.cookies.get("auth-token")?.value
      if (token) {
        const user = verifyToken(token)
        if (user) {
          userId = user.id
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user with enrolled courses
    const userData = await db.getUserById(new ObjectId(userId))
    
    if (!userData || !userData.enrolledCourses || userData.enrolledCourses.length === 0) {
      return NextResponse.json({
        stats: {
          enrolledCourses: 0,
          completedLessons: 0,
          totalProgress: 0,
          averageProgress: 0
        }
      })
    }

    // Calculate user-specific stats
    const enrolledCourses = userData.enrolledCourses.length
    const completedLessons = 0 // For now, since we don't have lesson progress in user schema
    const totalProgress = 0 // For now, since we don't have progress in user schema
    const averageProgress = 0 // For now, since we don't have progress in user schema

    return NextResponse.json({
      stats: {
        enrolledCourses,
        completedLessons,
        totalProgress,
        averageProgress
      }
    })
  } catch (error) {
    console.error("Failed to get user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
