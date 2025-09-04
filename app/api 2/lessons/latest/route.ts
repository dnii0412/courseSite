import { NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
    try {
        const db = Database.getInstance()
        const latestLesson = await db.getLatestLesson()
        return NextResponse.json({ lesson: latestLesson })
    } catch (error) {
        console.error("Error fetching latest lesson:", error)
        return NextResponse.json({ lesson: null })
    }
}
