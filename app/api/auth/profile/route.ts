import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    // Try NextAuth session first
    const session = await auth()
    
    if (session?.user?.email) {

      const user = await db.getUserByEmail(session.user.email)
      
      if (user) {
        return NextResponse.json({ user })
      }
    }
    
    // Fallback to custom auth
    const token = request.cookies.get("auth-token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }


    const userData = await db.getUserById(new ObjectId(user.id))
    
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    let userId: string | null = null

    // First try NextAuth.js session
    try {
      const session = await auth()
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch (error) {
      console.log("NextAuth session check failed, trying custom auth")
    }

    // If NextAuth failed, try custom auth token
    if (!userId) {
      const token = request.cookies.get("auth-token")?.value
      if (token) {
        const user = verifyToken(token)
        if (user) {
          userId = user.id
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, newPassword, confirmPassword } = body

    // Validate password if provided
    if (newPassword || confirmPassword) {
      if (!newPassword || !confirmPassword) {
        return NextResponse.json({ error: "Both password fields are required" }, { status: 400 })
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: any = { name, email }
    if (phone !== undefined && phone !== null) {
      updateData.phone = phone
    }
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Update user in database - handle invalid ObjectId
    let success;
    try {
      if (ObjectId.isValid(userId)) {
        success = await db.updateUser(new ObjectId(userId), updateData)
      } else {
        return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    if (success) {
      return NextResponse.json({ message: "Profile updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
