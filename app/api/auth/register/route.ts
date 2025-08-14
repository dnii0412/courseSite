import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Бүх талбарыг бөглөнө үү' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Энэ имэйл хаяг бүртгэлтэй байна' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user using the User model
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await newUser.save()

    return NextResponse.json(
      { 
        message: 'Бүртгэл амжилттай үүслээ',
        userId: newUser._id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    )
  }
}
