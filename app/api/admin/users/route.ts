import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const users = await db.getAllUsers()
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["student", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userId = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      enrolledCourses: [],
    })

    return NextResponse.json({ 
      message: "User created successfully",
      userId 
    }, { status: 201 })
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
