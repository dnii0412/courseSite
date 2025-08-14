import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    
    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId parameter' }, { status: 400 })
    }

    const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID
    const API_KEY = process.env.BUNNY_STREAM_API_KEY

    if (!LIBRARY_ID || !API_KEY) {
      return NextResponse.json({ error: 'Bunny.net credentials missing' }, { status: 500 })
    }

    // Check video status on Bunny.net
    const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
      headers: {
        'AccessKey': API_KEY,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch video status',
        status: response.status,
        statusText: response.statusText
      }, { status: response.status })
    }

    const videoData = await response.json()
    
    return NextResponse.json({
      success: true,
      videoId,
      status: videoData.status || 'unknown',
      data: videoData
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ 
      error: 'Status check failed',
      details: String(error)
    }, { status: 500 })
  }
}
