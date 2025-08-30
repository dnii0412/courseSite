import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { bunnyVideoService } from "@/lib/bunny-video"

// Configure for large file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parser for large files
    responseLimit: false, // Disable response size limit
  },
}

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

    // Get upload metadata from headers
    const uploadLength = request.headers.get('upload-length')
    const uploadMetadata = request.headers.get('upload-metadata')
    const tusResumable = request.headers.get('tus-resumable')

    console.log('🚀 TUS Upload Request:', {
      uploadLength,
      uploadMetadata,
      tusResumable,
      allHeaders: Object.fromEntries(request.headers.entries())
    })

    if (!uploadLength) {
      return NextResponse.json({ 
        error: "Missing Upload-Length header",
        details: "TUS requires Upload-Length header for file size"
      }, { status: 400 })
    }

    const fileSize = parseInt(uploadLength)
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)
    console.log(`📊 File size: ${fileSizeMB} MB (${fileSize} bytes)`)

    // Parse metadata if provided
    let filename = 'unknown'
    let contentType = 'application/octet-stream'
    
    if (uploadMetadata) {
      const metadata = uploadMetadata.split(',').reduce((acc, item) => {
        const [key, value] = item.split(' ')
        if (key && value) {
          acc[key] = decodeURIComponent(value)
        }
        return acc
      }, {} as Record<string, string>)
      
      filename = metadata.filename || 'unknown'
      contentType = metadata.contentType || 'application/octet-stream'
    }

    console.log(`📋 File info: ${filename} (${contentType})`)

    // Validate file type
    const allowedTypes = [
      "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv", "video/webm",
      "video/x-msvideo", "video/quicktime", "video/x-ms-wmv", "video/x-flv"
    ]
    
    const fileExtension = filename.split('.').pop()?.toLowerCase()
    const allowedExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"]
    
    const isValidType = allowedTypes.includes(contentType) || 
                       (fileExtension && allowedExtensions.includes(fileExtension))
    
    if (!isValidType) {
      console.log("❌ Invalid file type:", { contentType, fileExtension })
      return NextResponse.json({ 
        error: "Unsupported file type",
        details: { contentType, fileExtension, allowedTypes, allowedExtensions }
      }, { status: 400 })
    }

    // Test Bunny.net connection
    console.log('🔗 Testing Bunny.net connection...')
    const connectionTest = await bunnyVideoService.testConnection()
    
    if (!connectionTest) {
      console.log('❌ Bunny.net connection test failed')
      return NextResponse.json({ 
        error: "Bunny.net service unavailable. Please check your configuration." 
      }, { status: 503 })
    }

    // Create video entry in Bunny.net
    console.log('🚀 Creating video entry in Bunny.net...')
    const videoEntry = await bunnyVideoService.getDirectUploadUrl({
      filename,
      fileSize,
      contentType
    })

    if (!videoEntry.success || !videoEntry.videoId) {
      console.log('❌ Failed to create video entry:', videoEntry.error)
      return NextResponse.json({ 
        error: videoEntry.error || "Failed to create video entry" 
      }, { status: 500 })
    }

    console.log('✅ Video entry created:', videoEntry.videoId)

    // Generate unique upload ID
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create upload URL for TUS
    const uploadUrl = `${request.nextUrl.origin}/api/admin/upload/tus/${uploadId}`

    console.log('✅ TUS Upload initialized:', { uploadId, uploadUrl, videoId: videoEntry.videoId })

    // Return TUS-compatible response with proper headers
    const response = NextResponse.json({
      uploadUrl,
      uploadId,
      videoId: videoEntry.videoId,
      message: "TUS upload initialized successfully. Use the uploadUrl for file uploads."
    })

    // Set TUS headers
    response.headers.set('Tus-Resumable', '1.0.0')
    response.headers.set('Location', uploadUrl)
    response.headers.set('Access-Control-Expose-Headers', 'Tus-Resumable, Location, Upload-Offset, Upload-Length')

    return response
  } catch (error) {
    console.error("❌ Failed to initialize TUS upload:", error)
    
    // Check if it's a file size error
    if (error instanceof Error && error.message.includes('413')) {
      return NextResponse.json({ 
        error: "File too large. Please check your server configuration for file size limits.",
        details: "The server is rejecting files larger than the configured limit. Contact your hosting provider to increase the limit."
      }, { status: 413 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, HEAD, PATCH, OPTIONS, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Upload-Length, Upload-Metadata, Tus-Resumable, Upload-Offset')
  response.headers.set('Access-Control-Expose-Headers', 'Tus-Resumable, Upload-Offset, Location, Upload-Length')
  
  return response
}
