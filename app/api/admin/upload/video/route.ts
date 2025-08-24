import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { bunnyVideoService } from "@/lib/bunny-video"
import { db } from "@/lib/database"

// POST /api/admin/upload/video - Upload video to Bunny.net
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

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = JSON.parse(formData.get('tags') as string || '[]')
    const category = formData.get('category') as string

    // Validate input
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Handle cases where File object might not have all properties
    const fileName = file.name || 'unknown'
    const fileType = file.type || 'unknown'
    const fileSize = file.size || 0

    console.log("File validation:", {
      name: fileName,
      type: fileType,
      size: fileSize,
      lastModified: file.lastModified,
      hasName: !!file.name,
      hasType: !!file.type,
      hasSize: !!file.size
    })

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024
    if (fileSize > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 100MB",
        details: { fileSize, maxSize, sizeInMB: (fileSize / (1024 * 1024)).toFixed(2) }
      }, { status: 400 })
    }

    // Check file type - more flexible validation
    const allowedMimeTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm',
      'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv'
    ]
    
    // Also check file extension as fallback
    const fileExtension = fileName.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
    
    const isValidMimeType = allowedMimeTypes.includes(fileType)
    const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension)
    const isValidType = isValidMimeType || isValidExtension
    
    console.log("Type validation:", {
      mimeType: fileType,
      isValidMimeType,
      fileExtension,
      isValidExtension,
      isValidType,
      allowedMimeTypes,
      allowedExtensions
    })
    
    if (!isValidType) {
      return NextResponse.json({ 
        error: "Unsupported file type",
        details: {
          receivedType: fileType,
          receivedExtension: fileExtension,
          allowedTypes: allowedMimeTypes,
          allowedExtensions: allowedExtensions
        }
      }, { status: 400 })
    }

    console.log("Starting video upload:", {
      filename: fileName,
      size: fileSize,
      type: fileType,
      title,
      description
    })

    // Upload to Bunny.net
    const uploadResult = await bunnyVideoService.uploadVideo(file, {
      title: title || fileName,
      description: description || 'Video lesson',
      tags: tags || ['lesson', 'course'],
      category: category || 'education'
    })

    if (!uploadResult.success) {
      return NextResponse.json({ 
        error: uploadResult.error || "Failed to upload video" 
      }, { status: 500 })
    }

    // Generate unique upload ID for tracking
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Save video metadata to MongoDB
    const videoData = {
      uploadId,
      bunnyVideoId: uploadResult.videoId!,
      videoUrl: uploadResult.videoUrl!,
      title: title || fileName,
      description: description || 'Video lesson',
      filename: fileName,
      fileSize: fileSize,
      fileType: fileType,
      uploadedBy: user.id,
      uploadedAt: new Date(),
      status: 'processing' // Bunny.net will process the video
    }

    // Save to database
    try {
      const videoId = await db.saveVideoMetadata(videoData)
      console.log("Video metadata saved to MongoDB with ID:", videoId)
    } catch (dbError) {
      console.error("Failed to save video metadata to MongoDB:", dbError)
      // Continue with the upload even if database save fails
    }

    console.log("Video upload completed successfully:", {
      uploadId,
      videoId: uploadResult.videoId,
      videoUrl: uploadResult.videoUrl
    })

    return NextResponse.json({
      uploadId,
      videoId: uploadResult.videoId,
      videoUrl: uploadResult.videoUrl,
      message: "Video uploaded successfully"
    })

  } catch (error) {
    console.error("Failed to upload video:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
