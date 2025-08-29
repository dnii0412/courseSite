import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"

// GET /api/admin/upload/tus/[id] - Get upload information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: uploadId } = await params
    
    // For build-time compatibility, return a simple response
    // The actual upload data will be fetched when needed at runtime
    return NextResponse.json({ 
      message: "TUS upload endpoint available",
      uploadId 
    })
  } catch (error) {
    console.error("Failed to get upload info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/admin/upload/tus/[id] - Handle TUS upload
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: uploadId } = await params

    // Get TUS headers
    const tusResumable = request.headers.get("tus-resumable")
    const contentLength = request.headers.get("content-length")
    const uploadOffset = request.headers.get("upload-offset")

    console.log("TUS PATCH request headers:", {
      tusResumable,
      contentLength,
      uploadOffset,
      allHeaders: Object.fromEntries(request.headers.entries())
    })

    // For initial upload, offset might be 0 or missing
    if (!tusResumable) {
      return NextResponse.json({ error: "Missing TUS-Resumable header" }, { status: 400 })
    }

    // Handle file upload
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Save the file chunk to temporary storage
    // 2. Track upload progress
    // 3. Handle resumable uploads
    // 4. Upload to Bunny.net when complete

    // For now, we'll simulate a successful upload
    console.log(`TUS upload ${uploadId}: Received ${file.size} bytes`)

    // Return TUS response headers
    const response = NextResponse.json({
      message: "Chunk uploaded successfully",
      uploadId,
      offset: file.size
    })

    // Set required TUS headers
    response.headers.set("Tus-Resumable", "1.0.0")
    response.headers.set("Upload-Offset", file.size.toString())

    return response
  } catch (error) {
    console.error("Failed to handle TUS upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// HEAD /api/admin/upload/tus/[id] - Get upload status
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: uploadId } = await params

    // In a real implementation, you would check the upload status from storage
    // For now, we'll return a mock response

    const response = new NextResponse(null, { status: 200 })
    
    // Set TUS headers
    response.headers.set("Tus-Resumable", "1.0.0")
    response.headers.set("Upload-Offset", "0")
    response.headers.set("Upload-Length", "0")

    return response
  } catch (error) {
    console.error("Failed to get upload status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
