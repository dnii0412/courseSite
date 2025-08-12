import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/password'
import { findUserByEmail, createUser } from '@/lib/users'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Энэ имэйлээр бүртгэл аль хэдийн байна' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)
    await createUser({ name, email, passwordHash, role: 'USER' })
    return NextResponse.json({ message: 'Амжилттай бүртгэгдлээ' })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
