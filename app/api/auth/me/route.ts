import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Import database and ObjectId
    const { db } = await import("@/lib/database")
    const { ObjectId } = await import("mongodb")

    // Get full user data from database
    const userData = await db.getUserById(new ObjectId(user.id))
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user data with additional fields
    return NextResponse.json({ 
      user: {
        id: userData._id?.toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        enrolledCourses: userData.enrolledCourses?.map(id => id.toString()) || [],
        phone: userData.phone,
        address: userData.address,
        bio: userData.bio,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      }
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
