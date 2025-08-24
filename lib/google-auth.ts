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
      console.error('Google token verification failed:', error)
      throw new Error('Invalid Google token')
    }
  }

  async exchangeCodeForTokens(code: string) {
    try {
      const { tokens } = await this.client.getToken(code)
      return tokens
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error)
      throw new Error('Failed to exchange authorization code for tokens')
    }
  }

  getAuthUrl() {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`
    
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      redirect_uri: redirectUri,
    })
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
