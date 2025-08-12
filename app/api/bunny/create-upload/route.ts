export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }

    const LIBRARY_ID_STR = process.env.BUNNY_LIBRARY_ID || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
    const API_KEY = process.env.BUNNY_STREAM_API_KEY

    if (!LIBRARY_ID_STR || !API_KEY) {
      return NextResponse.json(
        { error: 'Bunny credentials missing. Set BUNNY_LIBRARY_ID and BUNNY_STREAM_API_KEY.' },
        { status: 500 }
      )
    }

    const LIBRARY_ID = parseInt(LIBRARY_ID_STR, 10)
    if (!Number.isFinite(LIBRARY_ID)) {
      return NextResponse.json({ error: 'Invalid BUNNY_LIBRARY_ID' }, { status: 400 })
    }

    // 1) Create video object -> get videoId (GUID)
    const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        AccessKey: API_KEY,
      } as any,
      body: JSON.stringify({ title: title || 'Untitled' }),
    })

    const createText = await createRes.text()
    let createJson: any = {}
    try {
      createJson = JSON.parse(createText)
    } catch {
      // keep raw
    }
    if (!createRes.ok) {
      return NextResponse.json(
        { error: 'Bunny create video failed', details: createJson || createText },
        { status: 502 }
      )
    }

    const videoId: string = createJson?.guid || createJson?.videoId || createJson?.id
    if (!videoId) {
      return NextResponse.json({ error: 'Bunny response missing video guid' }, { status: 502 })
    }

    // 2) Generate pre-signed headers for TUS upload
    const expires = Math.floor(Date.now() / 1000) + 10 * 60 // 10 minutes
    const sigSource = `${LIBRARY_ID}${API_KEY}${expires}${videoId}`
    const authorizationSignature = crypto.createHash('sha256').update(sigSource).digest('hex')

    return NextResponse.json({
      libraryId: LIBRARY_ID,
      videoId,
      authorizationSignature,
      authorizationExpire: expires,
      tusEndpoint: 'https://video.bunnycdn.com/tusupload',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Route crashed', details: String(error?.message || error) },
      { status: 500 }
    )
  }
}


