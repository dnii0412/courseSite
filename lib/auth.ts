import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}

// Server-side helper to read the current user from cookies in server components
export function getUserFromCookies(): null | {
  userId: string
  email?: string
  role?: string
} {
  try {
    const token = cookies().get('token')?.value
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}
