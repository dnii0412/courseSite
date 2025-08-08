import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { verifyToken } from '@/lib/auth'

export async function POST(
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

    const order = await Order.findOne({ _id: orderId, user: user.userId })
    if (!order) {
      return NextResponse.json(
        { error: 'Захиалга олдсонгүй' },
        { status: 404 }
      )
    }

    if (order.status === 'pending') {
      order.status = 'failed'
      await order.save()
    }

    return NextResponse.json({ message: 'Захиалга цуцлагдлаа', status: order.status })
  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json(
      { error: 'Захиалга цуцлахад алдаа гарлаа' },
      { status: 500 }
    )
  }
}


