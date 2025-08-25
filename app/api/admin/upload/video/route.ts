import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { bunnyVideoService } from "@/lib/bunny-video"

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

    const formData = await request.formData()
    const videoFile = formData.get("videoFile") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!videoFile || !title || !description) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: { 
          videoFile: !!videoFile, 
          title: !!title, 
          description: !!description 
        }
      }, { status: 400 })
    }

    console.log("Starting video upload to Bunny.net...")
    console.log("File size:", videoFile.size)
    console.log("File type:", videoFile.type)

    const upload = await bunnyVideoService.uploadVideo(videoFile, {
      title,
      description,
      tags: [],
      category: "education"
    })

    console.log("Upload result:", upload)

    if (!upload.success || !upload.videoId || !upload.videoUrl) {
      return NextResponse.json({ 
        error: upload.error || "Upload failed" 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      videoId: upload.videoId,
      videoUrl: upload.videoUrl
    })
  } catch (error) {
    console.error("Video upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
