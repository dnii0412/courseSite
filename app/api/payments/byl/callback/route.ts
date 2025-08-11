import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Course } from '@/lib/models/course'
import { User } from '@/lib/models/user'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Read raw body for signature verification
    const raw = await request.text()

    // Verify webhook signature if secret is configured
    const secret = process.env.BYL_WEBHOOK_SECRET || ''
    if (secret) {
      const providedSig =
        request.headers.get('Byl-Signature') ||
        request.headers.get('byl-signature') ||
        request.headers.get('x-byl-signature') ||
        request.headers.get('x-signature') ||
        request.headers.get('x-webhook-signature') ||
        ''
      const expectedSig = crypto.createHmac('sha256', secret).update(raw).digest('hex')
      if (!providedSig || providedSig !== expectedSig) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const parsed = JSON.parse(raw || '{}')
    // Accept both legacy shape { invoice_id, payment_status } and BYL webhook shape { type, data.object }
    const invoice_id = parsed?.invoice_id ?? parsed?.data?.object?.id ?? parsed?.data?.id
    const statusStr = parsed?.payment_status ?? parsed?.data?.object?.status ?? parsed?.status
    const eventType = parsed?.type ?? ''
    const isPaid = String(statusStr || '').toLowerCase() === 'paid' || /invoice\.paid/i.test(eventType)

    // Find order by Byl invoice ID
    const order = await Order.findOne({ bylInvoiceId: invoice_id })
    if (!order) {
      return NextResponse.json(
        { error: 'Захиалга олдсонгүй' },
        { status: 404 }
      )
    }

    if (isPaid) {
      // Update order status
      await Order.findByIdAndUpdate(order._id, {
        status: 'completed',
        paidAt: new Date()
      })

      // Mirror access on the user document
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
    console.error('Byl callback error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
