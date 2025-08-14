import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function requireAdmin(request: NextRequest) {
  try {
    const decoded = await verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(decoded.userId).select('role').lean() as { role: string } | null
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return decoded
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}

export async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const decoded = await verifyToken(request)
    if (!decoded) return false

    await connectDB()
    const user = await User.findById(decoded.userId).select('role').lean() as { role: string } | null
    
    return user?.role === 'ADMIN'
  } catch (error) {
    return false
  }
}
