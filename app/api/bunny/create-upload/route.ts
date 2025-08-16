import { NextResponse } from "next/server"
import crypto from "crypto"

type CreateVideoRes = { guid: string }

export async function POST(req: Request) {
  try {
    const { title, collectionId, thumbnailTime, lessonId } = await req.json()

    const libraryId = process.env.BUNNY_LIBRARY_ID!
    const apiKey = process.env.BUNNY_STREAM_API_KEY!
    
    if (!libraryId || !apiKey) {
      return NextResponse.json({ error: "Missing Bunny env vars" }, { status: 500 })
    }

    console.log('Creating video with:', { title, libraryId, hasApiKey: !!apiKey, lessonId })

    // 1) Create a video object to obtain VideoId (guid)
    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: apiKey,
      },
      body: JSON.stringify({ 
        title, 
        collectionId, 
        thumbnailTime,
        metadata: { lessonId } // Store lessonId in video metadata
      }),
    })

    if (!createRes.ok) {
      const msg = await createRes.text()
      console.error('Create video failed:', createRes.status, msg)
      return NextResponse.json({ error: `Create video failed: ${msg}` }, { status: createRes.status })
    }

    const data = (await createRes.json()) as CreateVideoRes
    const videoId = data.guid

    console.log('Video created successfully:', videoId)

    // 2) Generate presigned headers for TUS
    const expiresInSeconds = 60 * 10 // valid for 10 minutes
    const expireUnix = Math.floor(Date.now() / 1000) + expiresInSeconds
    
    // Generate signature according to Bunny.net documentation
    // Format: libraryId + apiKey + expireUnix + videoId
    const signaturePayload = `${libraryId}${apiKey}${expireUnix}${videoId}`
    const authorizationSignature = crypto.createHash("sha256").update(signaturePayload).digest("hex")
    
    console.log('Signature debug:', {
      payload: signaturePayload,
      signature: authorizationSignature,
      libraryId,
      videoId,
      expireUnix
    })

    const uploadConfig = {
      // Use direct upload instead of TUS for now
      endpoint: `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/octet-stream',
      },
      video: { id: videoId, title, collectionId, thumbnailTime },
      uploadMethod: 'direct' // Indicate this is a direct upload
    }
    
    console.log('Final upload config:', uploadConfig)

    console.log('Generated TUS config:', {
      endpoint: uploadConfig.endpoint,
      videoId,
      expiresIn: expiresInSeconds,
      hasSignature: !!authorizationSignature,
      libraryId,
      hasApiKey: !!apiKey
    })

    return NextResponse.json({ upload: uploadConfig })

  } catch (error) {
    console.error('Create upload error:', error)
    return NextResponse.json({ 
      error: 'Route crashed',
      details: String(error)
    }, { status: 500 })
  }
}


