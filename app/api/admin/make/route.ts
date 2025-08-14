import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(()=>({}))
    const email = body?.email as string | undefined
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    // Require ADMIN in production; allow in dev for bootstrap
    const decoded = await verifyToken(req)
    const isDev = process.env.NODE_ENV !== 'production'
    if (!isDev) {
      if (!decoded || String(decoded.role).toUpperCase() !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    await connectDB()
    const user = await User.findOneAndUpdate({ email }, { role: 'ADMIN' }, { new: true })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, role: user.role } })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


