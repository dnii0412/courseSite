import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(()=>({}))
    const email = body?.email as string | undefined
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    // Require ADMIN in production; allow in dev for bootstrap
    const isDev = process.env.NODE_ENV !== 'production'
    if (!isDev) {
      // Check if current user is admin
      await connectDB()
      const currentUser = await User.findOne({ email: session.user.email })
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    await connectDB()
    const user = await User.findOneAndUpdate({ email }, { role: 'ADMIN' }, { new: true })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, role: user.role } })
  } catch (e) {
    console.error('Error in admin make route:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


