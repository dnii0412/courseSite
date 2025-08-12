import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import bcrypt from 'bcryptjs'

export async function GET(_request: NextRequest) {
  try {
    await connectDB()
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('name email role createdAt updatedAt')
      .lean()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Шаардлагатай талбарууд дутуу' }, { status: 400 })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Энэ имэйлээр бүртгэлтэй хэрэглэгч байна' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    // Normalize role to match schema ('USER' | 'ADMIN')
    const normalized = String(role || '').toUpperCase()
    const roleForSchema = normalized === 'ADMIN' ? 'ADMIN' : 'USER'

    const user = await User.create({ name, email, password: hashed, role: roleForSchema })
    return NextResponse.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json({ error: 'Хэрэглэгч үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
