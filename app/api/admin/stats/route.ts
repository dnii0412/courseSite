import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import { Stats } from '@/lib/models/stats'
import { User } from '@/lib/models/user'

export async function GET() {
  try {
    await connectDB()
    
    // Get stats from database
    let statsDoc = await Stats.findOne()
    
    // If no stats exist, create default ones
    if (!statsDoc) {
      const defaultStats = [
        {
          title: 'Нийт сурагч',
          value: '3,200+',
          description: 'Идэвхтэй суралцаж буй сурагчид',
          icon: 'Users',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          order: 0
        },
        {
          title: 'Дундаж үнэлгээ',
          value: '4.8/5',
          description: 'Сурагчдын сэтгэгдэл',
          icon: 'Star',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          order: 1
        },
        {
          title: 'Хичээл дуусгасан',
          value: '15,000+',
          description: 'Амжилттай төгссөн хичээлүүд',
          icon: 'Trophy',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          order: 2
        },
        {
          title: 'Амжилтын хувь',
          value: '94%',
          description: 'Сурагчдын амжилттай төгсөлт',
          icon: 'Target',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          order: 3
        },
        {
          title: 'Хурдтай өсөлт',
          value: '+127%',
          description: 'Энэ жилийн өсөлт',
          icon: 'TrendingUp',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          order: 4
        },
        {
          title: 'Гэрчилгээ',
          value: '12,500+',
          description: 'Олгосон гэрчилгээнүүд',
          icon: 'Award',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          order: 5
        }
      ]
      
      statsDoc = new Stats({ stats: defaultStats })
      await statsDoc.save()
      console.log('✅ Created default stats in database')
    }

    return NextResponse.json({
      success: true,
      stats: statsDoc.stats
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
    await connectDB()
    
    // Check admin session
    const adminSession = request.cookies.get('admin-session')?.value
    if (!adminSession) {
      return NextResponse.json(
        { success: false, error: 'No admin session found' },
        { status: 401 }
      )
    }

    // Verify the JWT token
    const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin session' },
        { status: 401 }
      )
    }

    // Verify user still exists and has admin role
    const user = await User.findById(decoded.userId).select('role')
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { stats } = body

    if (!stats || !Array.isArray(stats)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stats data' },
        { status: 400 }
      )
    }

    // Add order field to each stat if missing
    const statsWithOrder = stats.map((stat, index) => ({
      ...stat,
      order: stat.order || index
    }))

    // Update or create stats document
    const result = await Stats.findOneAndUpdate(
      {}, // Find any existing document
      { 
        stats: statsWithOrder,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true // Create if doesn't exist
      }
    )

    console.log('✅ Stats saved to database:', result.stats.length, 'items')

    return NextResponse.json({
      success: true,
      message: 'Stats updated successfully',
      stats: result.stats
    })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}
