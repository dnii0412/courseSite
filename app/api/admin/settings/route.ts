import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"

// GET /api/admin/settings - Get platform settings
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

    // Get platform settings
    const settings = await db.getPlatformSettings()
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update platform settings
export async function PUT(request: NextRequest) {
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

    const settings = await request.json()

    // Update platform settings
    const success = await db.updatePlatformSettings(settings)
    
    if (!success) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
