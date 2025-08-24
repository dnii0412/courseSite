import { OAuth2Client } from 'google-auth-library'

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET || ''

export class GoogleAuthService {
  private client: OAuth2Client

  constructor() {
    // Validate that required credentials are set
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error(
        'Google OAuth credentials not configured. Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment variables.'
      )
    }
    
    console.log("Initializing OAuth2Client with:", {
      clientId: `${GOOGLE_CLIENT_ID.substring(0, 10)}...`,
      clientSecretLength: GOOGLE_CLIENT_SECRET.length,
      hasClientId: !!GOOGLE_CLIENT_ID,
      hasClientSecret: !!GOOGLE_CLIENT_SECRET
    })
    
    this.client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  }

  async verifyToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      })
      
      const payload = ticket.getPayload()
      if (!payload) {
        throw new Error('Invalid token payload')
      }

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub, // Google's unique user ID
      }
    } catch (error) {

      throw new Error('Invalid Google token')
    }
  }

  async exchangeCodeForTokens(code: string) {
    try {
      console.log("Attempting to exchange code for tokens...")
      
      // Use the same redirect URI that was used during authorization
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/google`
      console.log("Using redirect URI for token exchange:", redirectUri)
      
      const { tokens } = await this.client.getToken({
        code,
        redirect_uri: redirectUri
      })
      
      console.log("Token exchange successful:", { 
        hasAccessToken: !!tokens.access_token,
        hasIdToken: !!tokens.id_token,
        hasRefreshToken: !!tokens.refresh_token
      })
      return tokens
    } catch (error) {
      console.error("Token exchange failed with error:", error)
      if (error instanceof Error) {
        console.error("Error details:", error.message)
        console.error("Error stack:", error.stack)
      }
      
      // Log additional error information if available
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response
        console.error("Google API response:", {
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data
        })
      }
      
      throw new Error(`Failed to exchange authorization code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  getAuthUrl() {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/google`
    
    console.log("Generating Google OAuth URL with:", {
      clientId: GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'Not set',
      redirectUri,
      hasClientSecret: !!GOOGLE_CLIENT_SECRET,
      envUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    })
    
    const authUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      redirect_uri: redirectUri,
    })
    
    console.log("Generated auth URL:", authUrl)
    console.log("Redirect URI in auth URL:", redirectUri)
    return authUrl
  }

  // Static method to check if OAuth is configured
  static isConfigured(): boolean {
    return !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)
  }

  // Get configuration status
  getConfigStatus() {
    return {
      hasClientId: !!process.env.AUTH_GOOGLE_ID,
      hasClientSecret: !!process.env.AUTH_GOOGLE_SECRET,
      isConfigured: GoogleAuthService.isConfigured(),
      clientId: process.env.AUTH_GOOGLE_ID ? `${process.env.AUTH_GOOGLE_ID.substring(0, 10)}...` : 'Not set',
    }
  }
}

// Only create the service if credentials are configured
export const googleAuthService = GoogleAuthService.isConfigured() 
  ? new GoogleAuthService() 
  : null
