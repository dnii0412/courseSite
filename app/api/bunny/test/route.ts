import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const LIBRARY_ID_STR = process.env.BUNNY_LIBRARY_ID || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
  const API_KEY = process.env.BUNNY_STREAM_API_KEY

  return NextResponse.json({
    environment: {
      BUNNY_LIBRARY_ID: process.env.BUNNY_LIBRARY_ID,
      NEXT_PUBLIC_BUNNY_LIBRARY_ID: process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID,
      BUNNY_STREAM_API_KEY: API_KEY ? 'SET' : 'NOT SET',
      finalLibraryId: LIBRARY_ID_STR,
      finalApiKey: API_KEY ? 'SET' : 'NOT SET'
    },
    status: {
      hasLibraryId: !!LIBRARY_ID_STR,
      hasApiKey: !!API_KEY,
      libraryIdValid: LIBRARY_ID_STR ? !isNaN(Number(LIBRARY_ID_STR)) : false
    }
  })
}
