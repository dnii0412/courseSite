import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { ObjectId } from "mongodb"

// GET /api/sub-courses - Get sub-courses by courseId (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Convert courseId to ObjectId
    let objectId: ObjectId
    try {
      objectId = new ObjectId(courseId)
    } catch {
      return NextResponse.json({ error: "Invalid course ID format" }, { status: 400 })
    }

    // Get sub-courses for the specified course
    const subCourses = await db.getSubCoursesByCourseId(objectId)
    
    return NextResponse.json({ subCourses })
  } catch (error) {
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
