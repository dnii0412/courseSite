import { NextRequest, NextResponse } from "next/server"
import { googleAuthService } from "@/lib/google-auth"
import { generateToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    if (!googleAuthService) {
      return NextResponse.redirect(new URL('/login?error=oauth_not_configured', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // Exchange code for tokens
    const tokens = await googleAuthService.exchangeCodeForTokens(code)
    
    if (!tokens.id_token) {
      return NextResponse.redirect(new URL('/login?error=no_id_token', request.url))
    }

    // Verify the ID token
    const googleUser = await googleAuthService.verifyToken(tokens.id_token)
    
    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', request.url))
    }

    // Check if user exists
    let user = await db.getUserByEmail(googleUser.email)
    
    if (!user) {
      // Create new user
      const userId = await db.createUser({
        name: googleUser.name || 'Google User',
        email: googleUser.email,
        password: '', // No password for Google users
        role: 'student',
        enrolledCourses: [],
        googleId: googleUser.sub,
        profilePicture: googleUser.picture,
      })
      
      user = await db.getUserById(userId)
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_creation_failed', request.url))
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Redirect to dashboard or home page
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error("Google OAuth callback error:", error)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }
}
