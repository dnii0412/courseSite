import { NextRequest, NextResponse } from "next/server"
import { googleAuthService } from "@/lib/google-auth"

export async function GET(request: NextRequest) {
  try {
    console.log("Google OAuth initiation - checking configuration...")
    
    if (!googleAuthService) {
      console.error("Google OAuth service not configured")
      return NextResponse.json({ 
        error: "Google OAuth is not configured. Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment variables.",
        configStatus: {
          hasClientId: !!process.env.AUTH_GOOGLE_ID,
          hasClientSecret: !!process.env.AUTH_GOOGLE_SECRET,
        }
      }, { status: 500 })
    }

    console.log("Google OAuth service configured, generating auth URL...")
    const authUrl = googleAuthService.getAuthUrl()
    console.log("Generated auth URL:", authUrl)
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Google OAuth initiation error:", error)
    return NextResponse.json({ 
      error: "Failed to initiate Google OAuth",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
