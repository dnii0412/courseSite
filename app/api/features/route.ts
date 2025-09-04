import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

// GET /api/features - Get platform features and stats for public display
export async function GET(request: NextRequest) {
  try {
    // Get platform settings
    const settings = await db.getPlatformSettings()

    // Return only the features and stats data for public consumption
    const response = NextResponse.json({
      features: settings.features || {
        feature1: {
          title: "Хэзээ ч, хаанаас ч",
          description: "Таны хүссэн цагт, хүссэн газартаас суралцах боломжтой. Интернэт холболттой компьютер, таблет эсвэл утас хүчилтэй.",
          icon: "🌍"
        },
        feature2: {
          title: "Чанартай агуулга",
          description: "Мэргэжлийн багш нартай, чанартай видео хичээллүүд. Практик даалгавар, тестүүд болон сертификат.",
          icon: "🎯"
        },
        feature3: {
          title: "Хувийн хөгжил",
          description: "Таны хурдад тохируулсан сургалт. Прогресс хяналт, хувийн дэвтэр болон багшийн дэмжлэг.",
          icon: "📈"
        }
      },
      stats: settings.stats || {
        totalStudents: "0",
        averageRating: "4.8",
        completedLessons: "0"
      }
    })

    // Set cache headers for better performance while allowing updates
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')

    return response
  } catch (error) {
    console.error("Failed to fetch features:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}