import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Delete auth cookie
    const response = NextResponse.json({ message: 'Logged out successfully' })
    // Prefer delete; set expired fallback for robustness
    try {
      response.cookies.delete('token')
    } catch {}
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0)
    })
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
} 