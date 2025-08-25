import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    
    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }
    
    // For NextAuth.js, we need to redirect to the signin page with the code
    // NextAuth will handle the OAuth flow automatically
    const signinUrl = new URL("/api/auth/signin", request.url)
    signinUrl.searchParams.set("callbackUrl", "/")
    signinUrl.searchParams.set("code", code)
    if (state) {
      signinUrl.searchParams.set("state", state)
    }
    
    return NextResponse.redirect(signinUrl)
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
