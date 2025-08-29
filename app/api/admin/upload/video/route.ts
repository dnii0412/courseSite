import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { bunnyVideoService } from "@/lib/bunny-video"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    // Check for NextAuth session first, then admin token
    const session = await auth()
    let user = null

    if (session?.user) {
      // NextAuth user - get full user data from database
      const { db } = await import("@/lib/database")
      const dbUser = await db.getUserByEmail(session.user.email!)
      if (dbUser && dbUser.role === "admin") {
        user = { id: dbUser._id.toString(), role: dbUser.role }
      }
    } else {
      // Admin token
      const token = request.cookies.get("admin-token")?.value
      if (token) {
        user = verifyToken(token)
      }
    }

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
