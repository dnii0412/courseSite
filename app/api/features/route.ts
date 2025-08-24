import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const settings = await db.getPlatformSettings()
    return NextResponse.json({ features: settings.features || null })
  } catch (error) {
    console.error("Error fetching features:", error)
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 })
  }
}
