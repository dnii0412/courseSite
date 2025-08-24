import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { ObjectId } from "mongodb"

// POST /api/admin/lessons - Create new lesson
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, description, subCourseId, order, isPreview, bunnyVideoId, videoUrl } = await request.json()

    // Validate input
    if (!title || !description || !subCourseId || !bunnyVideoId || !videoUrl) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: { 
          title: !!title, 
          description: !!description, 
          subCourseId: !!subCourseId, 
          bunnyVideoId: !!bunnyVideoId, 
          videoUrl: !!videoUrl 
        }
      }, { status: 400 })
    }

    // Create lesson
    const lessonId = await db.createLesson({
      title,
      description,
      subCourseId,
      order: order || 1,
      isPreview: isPreview || false,
      videoUrl, // Now set from Bunny.net upload
      duration: 0, // Will be calculated from video later
      bunnyVideoId, // Now set from Bunny.net upload
      tusUploadId: "" // Legacy field, can be removed later
    })

    return NextResponse.json({ 
      message: "Lesson created successfully",
      lessonId 
    }, { status: 201 })
  } catch (error) {
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/admin/lessons?subCourseId=...
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const subCourseId = searchParams.get("subCourseId")
    if (!subCourseId) {
      return NextResponse.json({ error: "subCourseId query param is required" }, { status: 400 })
    }

    let objectId: ObjectId
    try {
      objectId = new ObjectId(subCourseId)
    } catch {
      return NextResponse.json({ error: "Invalid subCourseId" }, { status: 400 })
    }

    const lessons = await db.getLessonsBySubCourseId(objectId)
    return NextResponse.json({ lessons })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
