import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // This route handles Google OAuth callbacks
    // NextAuth will handle the actual OAuth flow
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    
    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }
    
    // Redirect to the main auth callback
    const redirectUrl = new URL("/api/auth/callback", request.url)
    redirectUrl.searchParams.set("code", code)
    if (state) {
      redirectUrl.searchParams.set("state", state)
    }
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Google callback error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
