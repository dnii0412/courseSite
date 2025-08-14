import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, identifier, password } = await request.json()

    // Resolve by identifier (username or email) or direct email
    let user = null as any
    let lookup = (email as string | undefined)?.trim()
    const id = (identifier as string | undefined)?.trim()
    if (!lookup && id) {
      lookup = id
    }

    if (!lookup) {
      return NextResponse.json(
        { error: 'И-мэйл эсвэл нэр шаардлагатай' },
        { status: 400 }
      )
    }

    if (lookup.includes('@')) {
      user = await User.findOne({ email: lookup.toLowerCase() })
    } else {
      // Case-insensitive exact match on name
      user = await User.findOne({ name: { $regex: `^${lookup}$`, $options: 'i' } })
    }
    if (!user) {
      return NextResponse.json(
        { error: 'Хэрэглэгч олдсонгүй' },
        { status: 401 }
      )
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Нууц үг буруу байна' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      message: 'Амжилттай нэвтэрлээ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    // Set HTTP-only cookie (path=/ so all routes receive it). Use actual protocol to decide 'secure'.
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.nextUrl.protocol === 'https:'
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
