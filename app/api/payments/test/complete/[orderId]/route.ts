import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Enrollment } from '@/lib/models/enrollment'
import { Course } from '@/lib/models/course'
import { User } from '@/lib/models/user'
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

    // Find the order and ensure it belongs to the current user
    const order = await Order.findOne({
      _id: orderId,
      user: user.userId,
      status: 'pending'
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Захиалга олдсонгүй эсвэл аль хэдийн төлөгдсөн' },
        { status: 404 }
      )
    }

    // Simulate payment completion
    await Order.findByIdAndUpdate(order._id, {
      status: 'completed',
      paidAt: new Date()
    })

    // In test mode, DO NOT create Enrollment document.
    // Only persist access in user's enrolledCourses to keep data under user block.
    await User.findByIdAndUpdate(order.user, {
      $addToSet: { enrolledCourses: order.course }
    })

    // Increment course studentsCount
    await Course.findByIdAndUpdate(order.course, {
      $inc: { studentsCount: 1 }
    })

    return NextResponse.json({
      message: 'Төлбөр амжилттай төлөгдлөө (тест горим)',
      orderId: order._id,
      status: 'completed'
    })

  } catch (error) {
    console.error('Test payment completion error:', error)
    return NextResponse.json(
      { error: 'Тест төлбөр төлөхэд алдаа гарлаа' },
      { status: 500 }
    )
  }
}
