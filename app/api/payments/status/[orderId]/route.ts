import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Enrollment } from '@/lib/models/enrollment'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
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
    let order = await Order.findOne({
      _id: orderId,
      user: user.userId
    }).populate('course', 'title')

    if (!order) {
      return NextResponse.json(
        { error: 'Захиалга олдсонгүй' },
        { status: 404 }
      )
    }

    let statusChangedToCompleted = false

    // If still pending, attempt BYL status sync (fallback when webhook not configured)
    if (
      order.status === 'pending' &&
      order.bylInvoiceId &&
      process.env.BYL_ACCESS_TOKEN &&
      process.env.BYL_PROJECT_ID
    ) {
      try {
        const bylBase = (process.env.BYL_API_URL || 'https://byl.mn').replace(/\/$/, '')
        const res = await fetch(
          `${bylBase}/api/v1/projects/${process.env.BYL_PROJECT_ID}/invoices/${order.bylInvoiceId}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${process.env.BYL_ACCESS_TOKEN}`,
            },
            cache: 'no-store',
          }
        )
        const data = await res.json().catch(() => ({}))
        const status = data?.data?.status || data?.status
        if (status === 'paid') {
          order.status = 'completed'
          order.paidAt = new Date()
          await order.save()
          statusChangedToCompleted = true
        } else if (status === 'void') {
          order.status = 'failed'
          await order.save()
        }
      } catch (e) {
        // swallow sync errors; we'll just return current order status
      }
    }

    // If still pending, attempt QPAY status sync
    if (
      order.status === 'pending' &&
      order.qpayInvoiceId &&
      process.env.QPAY_API_URL &&
      process.env.QPAY_ACCESS_TOKEN
    ) {
      try {
        const res = await fetch(
          `${process.env.QPAY_API_URL.replace(/\/$/, '')}/v2/invoice/${order.qpayInvoiceId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.QPAY_ACCESS_TOKEN}`,
            },
            cache: 'no-store',
          }
        )
        const data = await res.json().catch(() => ({}))
        const status = data?.status || data?.invoice_status || (data?.paid ? 'PAID' : undefined)
        if (status && String(status).toUpperCase() === 'PAID') {
          order.status = 'completed'
          order.paidAt = new Date()
          await order.save()
          statusChangedToCompleted = true
        }
      } catch (_) {
        // ignore
      }
    }

    // Ensure enrollment exists when order is completed (idempotent safety)
    if (order.status === 'completed') {
      const existing = await Enrollment.findOne({ user: user.userId, course: order.course })
      if (!existing) {
        await Enrollment.create({ user: user.userId, course: order.course, enrolledAt: new Date(), progress: 0 })
        await User.findByIdAndUpdate(user.userId, { $addToSet: { enrolledCourses: order.course } })
        await Course.findByIdAndUpdate(order.course, { $inc: { studentsCount: 1 } })
      } else {
        // still mirror on user for safety
        await User.findByIdAndUpdate(user.userId, { $addToSet: { enrolledCourses: order.course } })
      }
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
