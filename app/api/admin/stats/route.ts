import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// In a real application, this would be stored in a database
// For now, we'll use a simple in-memory storage
let statsData = [
  {
    id: '1',
    title: 'Нийт сурагч',
    value: '3,200+',
    description: 'Идэвхтэй суралцаж буй сурагчид',
    icon: 'Users',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: '2',
    title: 'Дундаж үнэлгээ',
    value: '4.8/5',
    description: 'Сурагчдын сэтгэгдэл',
    icon: 'Star',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    id: '3',
    title: 'Хичээл дуусгасан',
    value: '15,000+',
    description: 'Амжилттай төгссөн хичээлүүд',
    icon: 'Trophy',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      stats: statsData
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated (optional for demo)
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()
    const { stats } = body

    if (!stats || !Array.isArray(stats)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stats data' },
        { status: 400 }
      )
    }

    // Update the stats data
    statsData = stats

    // In a real application, you would save this to a database
    // await db.stats.updateMany({}, { $set: { stats } })

    return NextResponse.json({
      success: true,
      message: 'Stats updated successfully',
      stats: statsData
    })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}
