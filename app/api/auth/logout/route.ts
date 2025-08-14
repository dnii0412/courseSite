import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Delete auth cookie
    const response = NextResponse.json({ message: 'Logged out successfully' })
    // Prefer delete; set expired fallback for robustness
    try {
      response.cookies.delete('token', { path: '/' })
    } catch {}
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.nextUrl.protocol === 'https:'
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: isHttps,
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