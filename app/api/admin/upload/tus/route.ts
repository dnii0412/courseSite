import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"

// POST /api/admin/upload/tus - Initialize TUS upload
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("admin-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    console.log("Full request body:", body)
    
    const { filename, fileSize, contentType } = body

    console.log("TUS Upload Request:", { filename, fileSize, contentType })

    // Validate input
    if (!filename || !fileSize || !contentType) {
      console.log("Missing fields:", { filename: !!filename, fileSize: !!fileSize, contentType: !!contentType })
      return NextResponse.json({ 
        error: "Missing required fields",
        details: { filename: !!filename, fileSize: !!fileSize, contentType: !!contentType },
        received: { filename, fileSize, contentType }
      }, { status: 400 })
    }

    // File size check removed - no size restrictions for video uploads
    console.log("File size:", fileSize, "bytes (no size limit enforced)")

    // Check file type - more flexible validation
    const allowedTypes = [
      "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv", "video/webm",
      "video/x-msvideo", "video/quicktime", "video/x-ms-wmv", "video/x-flv"
    ]
    
    // Also check file extension as fallback
    const fileExtension = filename.split('.').pop()?.toLowerCase()
    const allowedExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"]
    
    const isValidType = allowedTypes.includes(contentType) || 
                       (fileExtension && allowedExtensions.includes(fileExtension))
    
    if (!isValidType) {
      console.log("Invalid file type:", { contentType, fileExtension, allowedTypes, allowedExtensions })
      return NextResponse.json({ 
        error: "Unsupported file type",
        details: { contentType, fileExtension, allowedTypes, allowedExtensions }
      }, { status: 400 })
    }

    // Generate unique upload ID
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create upload URL for TUS
    const uploadUrl = `${request.nextUrl.origin}/api/admin/upload/tus/${uploadId}`

    console.log("TUS Upload initialized:", { uploadId, uploadUrl })

    // Store upload metadata (in a real app, you'd store this in a database)
    // For now, we'll return the upload URL and ID

    return NextResponse.json({
      uploadUrl,
      uploadId,
      message: "TUS upload initialized successfully"
    })
  } catch (error) {
    console.error("Failed to initialize TUS upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
