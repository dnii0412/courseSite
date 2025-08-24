import { NextRequest, NextResponse } from "next/server"
import { googleAuthService } from "@/lib/google-auth"

export async function GET(request: NextRequest) {
  try {
    if (!googleAuthService) {
      return NextResponse.json({ 
        error: "Google OAuth is not configured. Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment variables.",
        configStatus: {
          hasClientId: !!process.env.AUTH_GOOGLE_ID,
          hasClientSecret: !!process.env.AUTH_GOOGLE_SECRET,
        }
      }, { status: 500 })
    }

    const authUrl = googleAuthService.getAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Google OAuth initiation error:", error)
    return NextResponse.json({ 
      error: "Failed to initiate Google OAuth",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
