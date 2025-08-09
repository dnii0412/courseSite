import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Course } from '@/lib/models/course'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()

    // Get course details
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json(
        { error: 'Хичээл олдсонгүй' },
        { status: 404 }
      )
    }

    // Create order
    const order = await Order.create({
      user: user.userId,
      course: courseId,
      amount: course.price,
      currency: 'MNT',
      status: 'pending'
    })

    console.log('Created order:', order._id)

    // Check if QPay environment variables are set
    if (!process.env.QPAY_API_URL || !process.env.QPAY_ACCESS_TOKEN || !process.env.QPAY_MERCHANT_CODE) {
      console.log('QPay credentials not found, using test mode')
      
      // Test mode - create a mock payment with a local placeholder image
      return NextResponse.json({
        orderId: order._id,
        qpayUrl: 'https://test.qpay.mn/pay',
        qrImage: '/placeholder.svg'
      })
    }

    // QPay API integration
    const qpayPayload: any = {
      invoice_code: `COURSE_${order._id}`,
      sender_invoice_no: order._id.toString(),
      invoice_receiver_code: process.env.QPAY_MERCHANT_CODE,
      invoice_description: `${course.title} хичээлийн төлбөр`,
      amount: course.price,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/qpay/callback`
    }

    if (process.env.QPAY_MCC_CODE) {
      qpayPayload.mcc_code = process.env.QPAY_MCC_CODE
    }

    console.log('QPay API URL:', process.env.QPAY_API_URL)
    console.log('QPay payload:', qpayPayload)

    const qpayResponse = await fetch(`${process.env.QPAY_API_URL}/v2/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QPAY_ACCESS_TOKEN}`
      },
      body: JSON.stringify(qpayPayload)
    })

    const qpayData = await qpayResponse.json()
    console.log('QPay response status:', qpayResponse.status)
    console.log('QPay response data:', qpayData)

    if (!qpayResponse.ok) {
      console.error('QPay API error:', qpayData)
      throw new Error(`QPay API error: ${qpayData.message || qpayData.error || 'Unknown error'}`)
    }

    // Update order with QPay invoice ID
    await Order.findByIdAndUpdate(order._id, {
      qpayInvoiceId: qpayData.invoice_id
    })

    return NextResponse.json({
      orderId: order._id,
      qpayUrl: qpayData.qr_text,
      qrImage: qpayData.qr_image
    })

  } catch (error) {
    console.error('QPay create error:', error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('QPay API error')) {
        return NextResponse.json(
          { error: `QPay алдаа: ${error.message}` },
          { status: 500 }
        )
      }
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'QPay серверт холбогдох боломжгүй байна' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Төлбөрийн систем дээр алдаа гарлаа' },
      { status: 500 }
    )
  }
}
