import { NextResponse } from "next/server"
import crypto from "crypto"

type CreateVideoRes = { guid: string }

export async function POST(req: Request) {
  try {
    const { title, collectionId, thumbnailTime } = await req.json()

    const libraryId = process.env.BUNNY_LIBRARY_ID!
    const apiKey = process.env.BUNNY_STREAM_API_KEY!
    
    if (!libraryId || !apiKey) {
      return NextResponse.json({ error: "Missing Bunny env vars" }, { status: 500 })
    }

    console.log('Creating video with:', { title, libraryId, hasApiKey: !!apiKey })

    // 1) Create a video object to obtain VideoId (guid)
    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: apiKey,
      },
      body: JSON.stringify({ title, collectionId, thumbnailTime }),
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
    const signaturePayload = `${libraryId}${apiKey}${expireUnix}${videoId}`
    const authorizationSignature = crypto.createHash("sha256").update(signaturePayload).digest("hex")

    const uploadConfig = {
      endpoint: `https://video.bunnycdn.com/tusupload/${videoId}`,
      headers: {
        AuthorizationSignature: authorizationSignature,
        AuthorizationExpire: expireUnix,
        LibraryId: Number(libraryId),
        VideoId: videoId,
      },
      video: { id: videoId, title, collectionId, thumbnailTime },
    }

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


