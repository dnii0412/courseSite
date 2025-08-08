import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } })
    }

    await connectDB()
    const dbUser = await User.findById(decoded.userId)
      .select('name email role')
      .lean<{ name: string; email: string; role: string }>()

    if (!dbUser) {
      return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } })
    }

    return NextResponse.json({
      user: {
        id: decoded.userId,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      }
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Auth me error:', error)
    // Fail open with user null to avoid crashing the client UI
    return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } })
  }
} 