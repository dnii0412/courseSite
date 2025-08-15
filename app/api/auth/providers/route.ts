import { NextResponse } from 'next/server'

export async function GET() {
  // Check which OAuth providers are configured
  const providers = {
    google: {
      enabled: !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    },
    facebook: {
      enabled: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    },
  }

  return NextResponse.json(providers)
}
