import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"

// GET /api/admin/media - Get all media items
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

    // Get all media items
    const mediaItems = await db.getAllMediaItems()
    
    return NextResponse.json({ mediaItems })
  } catch (error) {
    console.error("Failed to fetch media items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
