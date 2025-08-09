import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Signs a Bunny Stream embed URL for private playback using Token Authentication
// Docs reference: Token = md5(SigningKey + Path + ExpirationUnix)
// Path example: /embed/{LIBRARY_ID}/{VIDEO_ID}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    const ttl = Number(searchParams.get('ttl') || '3600')

    const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
    const signingKey = process.env.BUNNY_SIGNING_KEY

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })
    }
    if (!libraryId) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_BUNNY_LIBRARY_ID' }, { status: 500 })
    }
    if (!signingKey) {
      return NextResponse.json({ error: 'Missing BUNNY_SIGNING_KEY' }, { status: 500 })
    }

    const expires = Math.floor(Date.now() / 1000) + ttl
    const path = `/embed/${libraryId}/${videoId}`
    const token = crypto.createHash('md5').update(signingKey + path + expires).digest('hex')

    const src = `https://iframe.mediadelivery.net${path}?token=${token}&expires=${expires}&autoplay=false`

    return NextResponse.json({ src }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sign Bunny URL' }, { status: 500 })
  }
}


