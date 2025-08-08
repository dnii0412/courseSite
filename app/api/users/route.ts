import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const users = await User.find()
      .populate('enrolledCourses', 'title')
      .sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (error) {
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
    const user = await User.create({ name, email, password: hashed, role: role || 'student' })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Хэрэглэгч үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
