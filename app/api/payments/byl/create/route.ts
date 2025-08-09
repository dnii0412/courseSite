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
    if (!process.env.BYL_ACCESS_TOKEN || !process.env.BYL_PROJECT_ID) {
      console.log('Byl credentials not found, using test mode')
      console.log('Environment check:', {
        BYL_API_URL: process.env.BYL_API_URL,
        BYL_ACCESS_TOKEN: process.env.BYL_ACCESS_TOKEN ? 'SET' : 'NOT SET',
        BYL_PROJECT_ID: process.env.BYL_PROJECT_ID ? 'SET' : 'NOT SET'
      })
      
      // Test mode - create a mock payment with a proper QR code image
      const testPayload = JSON.stringify({ gw: 'byl-test', orderId: String(order._id), ts: Date.now() })
      const testQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(testPayload)}&cb=${Date.now()}`
      
      return NextResponse.json({
        orderId: order._id,
        bylUrl: 'https://test.byl.mn/pay',
        qrImage: testQrCode
      })
    }

    console.log('Using real Byl API with credentials')

    // Byl API integration via token + project id
    // Normalize BYL base to origin to avoid '/v2' or other paths in env
    const bylOrigin = (() => {
      try {
        return new URL(process.env.BYL_API_URL || 'https://byl.mn').origin
      } catch {
        return 'https://byl.mn'
      }
    })()
    const bylEndpoint = `${bylOrigin}/api/v1/projects/${process.env.BYL_PROJECT_ID}/invoices`
    const bylPayload = {
      amount: course.price,
      description: `${course.title} - Order ${order._id}`,
      auto_advance: true
    }

    console.log('Byl endpoint:', bylEndpoint)
    console.log('Byl payload:', bylPayload)

    // Try to call Byl API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const bylResponse = await fetch(bylEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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

      // Extract invoice data
      const invoiceId = bylData?.data?.id || bylData?.id
      const invoiceUrl = bylData?.data?.url || bylData?.url
      if (!invoiceId || !invoiceUrl) {
        console.error('Unexpected Byl response (no invoice id):', bylData)
        throw new Error('Byl API did not return expected invoice data')
      }

      // Update order with Byl invoice ID
      await Order.findByIdAndUpdate(order._id, {
        bylInvoiceId: String(invoiceId)
      })

      // Use BYL-provided secure url for payment
      const payUrl = String(invoiceUrl)
      // Provide a QR image via a public QR generator for the pay URL
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payUrl)}&cb=${Date.now()}`

      return NextResponse.json({
        orderId: order._id,
        bylUrl: payUrl,
        qrImage
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
