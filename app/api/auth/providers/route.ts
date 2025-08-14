import { NextResponse } from 'next/server'

export async function GET() {
  // Check which OAuth providers are configured
  const providers = {
    google: {
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    facebook: {
      enabled: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    },
  }

  return NextResponse.json(providers)
}
