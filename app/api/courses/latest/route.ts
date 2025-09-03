import { NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const db = Database.getInstance()
    const latestCourse = await db.getLatestCourse()
    return NextResponse.json({ course: latestCourse })
  } catch (error) {
    console.error("Error fetching latest course:", error)
    return NextResponse.json({ course: null })
  }
}
