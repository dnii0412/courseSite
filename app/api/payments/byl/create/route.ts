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

    // Check if Byl environment variables are set
    if (!process.env.BYL_API_URL || !process.env.BYL_ACCESS_TOKEN) {
      console.log('Byl credentials not found, using test mode')
      console.log('Environment check:', {
        BYL_API_URL: process.env.BYL_API_URL,
        BYL_ACCESS_TOKEN: process.env.BYL_ACCESS_TOKEN ? 'SET' : 'NOT SET'
      })
      
      // Test mode - create a mock payment with a proper QR code image
      const testQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TEST_PAYMENT_' + order._id
      
      return NextResponse.json({
        orderId: order._id,
        bylUrl: 'https://test.byl.mn/pay',
        qrImage: testQrCode
      })
    }

    console.log('Using real Byl API with credentials')

    // Byl API integration - without merchant code
    const bylPayload = {
      invoice_code: `COURSE_${order._id}`,
      sender_invoice_no: order._id.toString(),
      invoice_description: `${course.title} хичээлийн төлбөр`,
      amount: course.price,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/byl/callback`
    }

    console.log('Byl API URL:', process.env.BYL_API_URL)
    console.log('Byl payload:', bylPayload)

    // Try to call Byl API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const bylResponse = await fetch(`${process.env.BYL_API_URL}/v2/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BYL_ACCESS_TOKEN}`
        },
        body: JSON.stringify(bylPayload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const bylData = await bylResponse.json()
      console.log('Byl response status:', bylResponse.status)
      console.log('Byl response data:', bylData)

      if (!bylResponse.ok) {
        console.error('Byl API error:', bylData)
        throw new Error(`Byl API error: ${bylData.message || bylData.error || 'Unknown error'}`)
      }

      // Check if we got the expected data
      if (!bylData.qr_image && !bylData.qrImage) {
        console.error('No QR image in Byl response:', bylData)
        throw new Error('Byl API did not return QR image')
      }

      // Update order with Byl invoice ID
      await Order.findByIdAndUpdate(order._id, {
        bylInvoiceId: bylData.invoice_id || bylData.invoiceId
      })

      return NextResponse.json({
        orderId: order._id,
        bylUrl: bylData.qr_text || bylData.qrText,
        qrImage: bylData.qr_image || bylData.qrImage
      })

    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('Byl API fetch error:', fetchError)
      
      // If Byl API fails, fall back to test mode
      console.log('Byl API failed, falling back to test mode')
      
      const testQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TEST_PAYMENT_' + order._id
      
      return NextResponse.json({
        orderId: order._id,
        bylUrl: 'https://test.byl.mn/pay',
        qrImage: testQrCode,
        fallback: true
      })
    }

  } catch (error) {
    console.error('Byl create error:', error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Byl API error')) {
        return NextResponse.json(
          { error: `Byl алдаа: ${error.message}` },
          { status: 500 }
        )
      }
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Byl серверт холбогдох боломжгүй байна' },
          { status: 500 }
        )
      }
      if (error.message.includes('QR image')) {
        return NextResponse.json(
          { error: 'Byl API-аас QR код авах боломжгүй байна' },
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
