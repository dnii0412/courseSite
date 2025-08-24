import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { db } from "@/lib/database"
import { bylService } from "@/lib/byl"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("Byl-Signature")
    const secret = process.env.BYL_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
    }

    // Verify webhook signature
    if (!bylService.verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)
    const { type, data } = event

    if (type === "invoice.paid") {
      const invoice = data.object
      
      // Find payment by Byl invoice ID
      const client = await (await import("@/lib/mongodb")).default
      const db_conn = client.db("new-era-platform")
      const payment = await db_conn.collection("payments").findOne({ 
        bylInvoiceId: invoice.id,
        status: "pending"
      })

      if (payment) {
        // Update payment status
        await db.updatePaymentStatus(
          new ObjectId(payment._id), 
          "completed", 
          invoice.id.toString(), 
          "byl"
        )

        // Create enrollment
        await db.createEnrollment({
          userId: payment.userId,
          courseId: payment.courseId,
          paymentId: new ObjectId(payment._id),
          enrolledAt: new Date(),
          completedLessons: [],
          progress: 0,
          isActive: true,
        })
      }
    } else if (type === "checkout.completed") {
      const checkout = data.object
      
      // Find payment by Byl checkout ID
      const client = await (await import("@/lib/mongodb")).default
      const db_conn = client.db("new-era-platform")
      const payment = await db_conn.collection("payments").findOne({ 
        bylCheckoutId: checkout.id,
        status: "pending"
      })

      if (payment) {
        // Update payment status
        await db.updatePaymentStatus(
          new ObjectId(payment._id), 
          "completed", 
          checkout.id.toString(), 
          "byl"
        )

        // Create enrollment
        await db.createEnrollment({
          userId: payment.userId,
          courseId: payment.courseId,
          paymentId: new ObjectId(payment._id),
          enrolledAt: new Date(),
          completedLessons: [],
          progress: 0,
          isActive: true,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Byl webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
