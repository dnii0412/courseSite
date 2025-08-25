import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { ObjectId } from "mongodb"

// GET /api/auth/my-courses - Get courses user has access to
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
    console.log("📖 User data fetched:", !!userData, "Enrolled courses:", userData?.enrolledCourses?.length || 0)
    
    if (!userData || !userData.enrolledCourses || userData.enrolledCourses.length === 0) {
      console.log("❌ No user data or no enrolled courses")
      return NextResponse.json({
        courses: [],
        enrolledCourses: []
      })
    }

    // Fetch courses that user has access to
    const courses = []
    console.log("🔍 Fetching courses for enrolled course IDs:", userData.enrolledCourses.map(id => id.toString()))
    
    for (const courseId of userData.enrolledCourses) {
      const course = await db.getCourseWithLessons(courseId)
      console.log("📚 Course fetched:", courseId.toString(), "Found:", !!course, "Active:", course?.isActive)
      if (course && course.isActive) {
        // Get user progress for this course
        const progress = await db.getUserProgress(new ObjectId(userId), courseId)
        
        courses.push({
          ...course,
          progress: progress.progress || 0,
          completedLessons: progress.completedLessons?.length || 0,
          enrollmentId: courseId.toString()
        })
      }
    }

    console.log("✅ Final courses array:", courses.length, "courses")
    return NextResponse.json({
      courses,
      enrolledCourses: userData.enrolledCourses
    })
  } catch (error) {
    console.error("Failed to get user courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
