import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import '@/lib/models/course'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { verify } from 'jsonwebtoken'

// Helper function to check admin authentication
async function checkAdminAuth(request: NextRequest) {
  try {
    // Check custom admin session
    const adminSession = request.cookies.get('admin-session')?.value
    
    if (adminSession) {
      const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
      
      if (decoded?.isAdmin) {
        return { isAdmin: true, userId: decoded.userId }
      }
    }

    return { isAdmin: false, userId: null }
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return { isAdmin: false, userId: null }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const { isAdmin } = await checkAdminAuth(request)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await connectDB()
    
    // Check if the User collection exists, if not return empty array
    try {
      const collections = await mongoose.connection.db?.listCollections().toArray()
      const userCollectionExists = collections?.some(col => col.name === 'users')
      
      if (!userCollectionExists) {
        console.log('User collection does not exist yet, returning empty array')
        return NextResponse.json({ success: true, data: [] })
      }
    } catch (collectionError) {
      console.log('Could not check collections, assuming they exist')
    }
    
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('name email createdAt enrolledCourses role')
      .populate('enrolledCourses', 'title')
      .lean()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('GET /api/users error:', error)
    
    // If it's a collection doesn't exist error, return empty array
    if (error instanceof Error && error.message.includes('collection')) {
      return NextResponse.json({ success: true, data: [] })
    }
    
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const { isAdmin } = await checkAdminAuth(request)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await connectDB()
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Шаардлагатай талбарууд дутуу' }, { status: 400 })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Энэ имэйлээр бүртгэлтэй хэрэглэгч байна' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hashed })
    return NextResponse.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json({ error: 'Хэрэглэгч үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
