import { NextRequest, NextResponse } from "next/server"
import { googleAuthService } from "@/lib/google-auth"
import { generateToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Check if Google OAuth service is configured
    if (!googleAuthService) {
      console.error("Google OAuth service not configured")
      return NextResponse.redirect(new URL('/login?error=oauth_not_configured', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.log("Google OAuth callback received:", { 
      hasCode: !!code, 
      hasError: !!error, 
      error: error,
      url: request.url 
    })

    if (error) {
      console.error("Google OAuth error:", error)
      return NextResponse.redirect(new URL(`/login?error=google_auth_failed&details=${error}`, request.url))
    }

    if (!code) {
      console.error("No authorization code received")
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // Exchange code for tokens
    console.log("Exchanging authorization code for tokens...")
    const tokens = await googleAuthService.exchangeCodeForTokens(code)
    
    if (!tokens.id_token) {
      console.error("No ID token received from Google")
      return NextResponse.redirect(new URL('/login?error=no_id_token', request.url))
    }

    console.log("Tokens received, verifying ID token...")
    // Verify the ID token
    const googleUser = await googleAuthService.verifyToken(tokens.id_token)
    
    if (!googleUser.email) {
      console.error("No email in Google user data")
      return NextResponse.redirect(new URL('/login?error=no_email', request.url))
    }

    console.log("Google user verified:", { email: googleUser.email, name: googleUser.name })

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.redirect(new URL(`/login?error=oauth_failed&details=${encodeURIComponent(errorMessage)}`, request.url))
  }
}
