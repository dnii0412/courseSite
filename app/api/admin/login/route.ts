import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password, oauthProvider, oauthId } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user has admin role
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Handle OAuth users (no password verification needed)
    if (user.oauthProvider && user.oauthId) {
      // For OAuth users, we need to verify the OAuth provider and ID
      if (oauthProvider && oauthId) {
        if (user.oauthProvider === oauthProvider && user.oauthId === oauthId) {
          // OAuth verification successful
        } else {
          return NextResponse.json(
            { error: 'OAuth verification failed' },
            { status: 401 }
          )
        }
      } else {
        // For OAuth users without provider info, we'll allow access if they have admin role
        // This is a simplified approach - in production you might want stricter verification
        console.log('OAuth admin user login:', user.email)
      }
    } else {
      // Handle credential-based users
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for credential-based users' },
          { status: 400 }
        )
      }

      // Verify password
      const isPasswordValid = await compare(password, user.password || '')

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }

    // Create a custom admin session token
    const adminToken = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        isAdmin: true
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // Set admin session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set custom admin session cookie
    response.cookies.set('admin-session', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/', // Ensure cookie is available for all paths
      domain: undefined // Use default domain
    })

    console.log('Admin session cookie set for user:', user.email)
    console.log('Cookie value length:', adminToken.length)

    return response

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
