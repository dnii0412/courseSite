import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    const { orderId } = params

    // Find the order and ensure it belongs to the current user
    const order = await Order.findOne({
      _id: orderId,
      user: user.userId
    }).populate('course', 'title')

    if (!order) {
      return NextResponse.json(
        { error: 'Захиалга олдсонгүй' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      orderId: order._id,
      status: order.status,
      amount: order.amount,
      course: order.course,
      createdAt: order.createdAt,
      paidAt: order.paidAt
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'Төлбөрийн статус шалгахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}
