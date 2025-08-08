import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Enrollment } from '@/lib/models/enrollment'
import { Course } from '@/lib/models/course'
import { User } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { invoice_id, payment_status } = await request.json()

    // Find order by QPay invoice ID
    const order = await Order.findOne({ qpayInvoiceId: invoice_id })
    if (!order) {
      return NextResponse.json(
        { error: 'Захиалга олдсонгүй' },
        { status: 404 }
      )
    }

    if (payment_status === 'PAID') {
      // Update order status
      await Order.findByIdAndUpdate(order._id, {
        status: 'completed',
        paidAt: new Date()
      })

      // Create enrollment for production callbacks (keeps detailed progress)
      await Enrollment.create({
        user: order.user,
        course: order.course,
        enrolledAt: new Date(),
        progress: 0
      })

      // Also mirror access on the user document
      await User.findByIdAndUpdate(order.user, {
        $addToSet: { enrolledCourses: order.course }
      })

      // Increment course studentsCount
      await Course.findByIdAndUpdate(order.course, {
        $inc: { studentsCount: 1 }
      })

      return NextResponse.json({ message: 'Төлбөр амжилттай' })
    } else {
      // Update order status to failed
      await Order.findByIdAndUpdate(order._id, {
        status: 'failed'
      })

      return NextResponse.json({ message: 'Төлбөр амжилтгүй' })
    }

  } catch (error) {
    console.error('QPay callback error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
