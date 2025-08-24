import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { ObjectId } from "mongodb"

// DELETE /api/admin/media/[id] - Delete media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const mediaId = new ObjectId(params.id)

    // Delete media item
    const success = await db.deleteMediaItem(mediaId)
    
    if (!success) {
      return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 })
    }

    return NextResponse.json({ message: "Media item deleted successfully" })
  } catch (error) {
    console.error("Failed to delete media item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
