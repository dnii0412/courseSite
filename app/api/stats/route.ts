import { NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const db = Database.getInstance()
    
    // First try to get stats from platform settings (where admin/stats saves)
    const settings = await db.getPlatformSettings()
    
    if (settings.stats) {
      console.log("Found stats in platform settings:", settings.stats)
      return NextResponse.json({ 
        stats: {
          totalStudents: settings.stats.totalStudents || 0,
          averageRating: settings.stats.averageRating || "4.8",
          completedLessons: settings.stats.completedLessons || 0
        }
      })
    }
    
    // Fallback to counting documents if no custom stats set
    console.log("No custom stats found, using document counts")
    const fallbackStats = await db.getStats()
    
    return NextResponse.json({ 
      stats: {
        totalStudents: fallbackStats.userCount,
        averageRating: "4.8",
        completedLessons: fallbackStats.enrollmentCount
      }
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ 
      stats: {
        totalStudents: 100,
        averageRating: "4.8",
        completedLessons: 15000
      }
    })
  }
}
