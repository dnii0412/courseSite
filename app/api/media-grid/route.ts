import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

// GET /api/media-grid - Get public media grid layout
export async function GET(request: NextRequest) {
  try {
    // Get grid layout
    const layout = await db.getMediaGridLayout()
    
    // Only return if published
    if (!layout || !layout.isPublished) {
      return NextResponse.json({ error: "Media grid not available" }, { status: 404 })
    }
    
    return NextResponse.json({ layout })
  } catch (error) {
    console.error("Error fetching public media grid:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
