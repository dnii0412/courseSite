import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { Course } from '@/lib/models/course'
import { User } from '@/lib/models/user'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get session using NextAuth
    const session = await getServerSession(authOptions) as any
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Нэвтрэх шаардлагатай' },
        { status: 401 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: 'Хэрэглэгч олдсонгүй' },
        { status: 404 }
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
      user: user._id,
      course: courseId,
      amount: course.price,
      currency: 'MNT',
      status: 'pending'
    })

    console.log('Created order:', order._id)

    // Require BYL creds
    const projectId = String(process.env.BYL_PROJECT_ID || '').trim()
    if (!process.env.BYL_ACCESS_TOKEN || !projectId) {
      console.log('BYL creds missing; returning simple test redirect URL')
      return NextResponse.json({ orderId: order._id, url: 'https://byl.mn', fallback: true })
    }

    // BYL v1 Invoices API per docs (force official host to avoid misconfig)
    const bylBaseEnv = (process.env.BYL_API_URL || '').replace(/\/$/, '')
    // Normalize to host root; strip any trailing /api/v1 to avoid duplications like /api/v1/api/v1
    const normalizedHost = bylBaseEnv && bylBaseEnv.startsWith('https://byl.mn')
      ? bylBaseEnv.replace(/\/api\/v1$/i, '')
      : 'https://byl.mn'
    const createUrl = `${normalizedHost}/api/v1/projects/${projectId}/invoices`
    const payload = {
      amount: Number(course.price),
      description: `${course.title} хичээлийн төлбөр`,
      auto_advance: true,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BYL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      const text = await res.text()
      let data: any = {}
      try { data = JSON.parse(text) } catch { data = { raw: text } }
      if (!res.ok) {
        console.error('BYL create non-200:', res.status, data)
        return NextResponse.json({ error: data?.message || data?.error || `BYL create failed (${res.status})` }, { status: 502 })
      }
      const inv = data?.data || data
      if (!inv?.id || !inv?.url) throw new Error('BYL missing invoice id or url')

      await Order.findByIdAndUpdate(order._id, { bylInvoiceId: String(inv.id) })
      return NextResponse.json({ orderId: order._id, url: String(inv.url) })
    } catch (e) {
      clearTimeout(timeoutId)
      console.error('BYL v1 create error:', e)
      const msg = e instanceof Error ? e.message : 'Unknown error'
      return NextResponse.json({ error: `Byl API алдаа: ${msg}` }, { status: 500 })
    }

  } catch (error) {
    console.error('Byl create error:', error)

    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Byl API error')) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
