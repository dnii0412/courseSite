import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function GET(request: NextRequest) {
  try {
    console.log('Admin session verification request received')
    
    // Get admin session cookie
    const adminSession = request.cookies.get('admin-session')?.value
    console.log('Admin session cookie found:', !!adminSession)
    console.log('Cookie value length:', adminSession?.length || 0)

    if (!adminSession) {
      console.log('No admin session cookie found')
      return NextResponse.json(
        { error: 'No admin session found' },
        { status: 401 }
      )
    }

    // Verify the JWT token
    console.log('Verifying JWT token...')
    const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    console.log('JWT decoded successfully:', !!decoded)
    console.log('Decoded data:', { userId: decoded?.userId, email: decoded?.email, role: decoded?.role, isAdmin: decoded?.isAdmin })

    if (!decoded || !decoded.isAdmin) {
      console.log('JWT verification failed or user is not admin')
      return NextResponse.json(
        { error: 'Invalid admin session' },
        { status: 401 }
      )
    }

    // Verify user still exists and has admin role
    await connectDB()
    const user = await User.findById(decoded.userId).select('role email name')

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'User no longer has admin access' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Admin session verification error:', error)
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 401 }
    )
  }
}
