import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Course } from '@/lib/models/course'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get user orders
    const orders = await Order.find({ userId: session.user.id })
      .populate('courseId')
      .sort({ createdAt: -1 })

    // Transform the data to match the expected format
    const payments = orders.map(order => {
      const course = order.courseId as any
      return {
        _id: order._id,
        amount: order.amount,
        currency: order.currency || '₮',
        status: order.status,
        courseId: course._id,
        courseTitle: course.title,
        paymentMethod: order.paymentMethod || 'Unknown',
        createdAt: order.createdAt
      }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
