import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Course } from '@/lib/models/course'
import { User } from '@/lib/models/user'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 })
    }

    const { orderId } = params

    let order = await Order.findOne({ _id: orderId, user: user.userId }).populate('course', 'title')
    if (!order) {
      return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 })
    }

    let statusChangedToCompleted = false

    // Try BYL sync (v1 invoices API)
    if (
      order.status === 'pending' &&
      order.bylInvoiceId &&
      process.env.BYL_ACCESS_TOKEN &&
      (process.env.BYL_PROJECT_ID || process.env.BYL_API_URL)
    ) {
      try {
        const bylBase = (process.env.BYL_API_URL || 'https://byl.mn').replace(/\/$/, '')
        // Prefer v1 invoices lookup when PROJECT_ID is available
        const lookupUrl = process.env.BYL_PROJECT_ID
          ? `${bylBase}/api/v1/projects/${process.env.BYL_PROJECT_ID}/invoices/${order.bylInvoiceId}`
          : `${bylBase}/v2/invoice/${order.bylInvoiceId}`
        const res = await fetch(lookupUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.BYL_ACCESS_TOKEN}`,
          },
          cache: 'no-store',
        })
        const data = await res.json().catch(() => ({}))
        const status = data?.data?.status || data?.status
        if (status && String(status).toLowerCase() === 'paid') {
          order.status = 'completed'
          order.paidAt = new Date()
          await order.save()
          statusChangedToCompleted = true
        } else if (status && String(status).toLowerCase() === 'void') {
          order.status = 'failed'
          await order.save()
        }
      } catch (_) {
        // ignore sync failure
      }
    }

    // Try QPay sync
    if (
      order.status === 'pending' &&
      order.qpayInvoiceId &&
      process.env.QPAY_API_URL &&
      process.env.QPAY_ACCESS_TOKEN
    ) {
      try {
        const res = await fetch(`${process.env.QPAY_API_URL.replace(/\/$/, '')}/v2/invoice/${order.qpayInvoiceId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.QPAY_ACCESS_TOKEN}`,
          },
          cache: 'no-store',
        })
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

    // Ensure access when order is completed (idempotent)
    if (order.status === 'completed' || statusChangedToCompleted) {
      const courseId = (order.course as any)?._id || order.course
      await User.findByIdAndUpdate(user.userId, { $addToSet: { enrolledCourses: courseId } })
      await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } })
    }

    return NextResponse.json(
      {
        orderId: order._id,
        status: order.status,
        amount: order.amount,
        course: order.course,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json({ error: 'Төлбөрийн статус шалгахад алдаа гарлаа' }, { status: 500 })
  }
}
