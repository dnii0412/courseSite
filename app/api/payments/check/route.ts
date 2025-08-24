import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { qpayService } from "@/lib/qpay"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { paymentId } = await request.json()

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    // Get payment from database
    const client = await (await import("@/lib/mongodb")).default
    const db_conn = client.db("new-era-platform")
    const payment = await db_conn.collection("payments").findOne({ _id: new ObjectId(paymentId) })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status === "completed") {
      return NextResponse.json({ status: "completed", payment })
    }

    // Check payment status with QPay
    if (payment.qpayInvoiceId) {
      const qpayStatus = await qpayService.checkPayment(payment.qpayInvoiceId)

      if (qpayStatus.payment_status === "PAID") {
        // Update payment status
        await db.updatePaymentStatus(new ObjectId(paymentId), "completed", qpayStatus.payment_id)

        // Create enrollment
        await db.createEnrollment({
          userId: new ObjectId(user.id),
          courseId: payment.courseId,
          paymentId: new ObjectId(paymentId),
          enrolledAt: new Date(),
          completedLessons: [],
          progress: 0,
          isActive: true,
        })

        return NextResponse.json({ status: "completed", payment: { ...payment, status: "completed" } })
      }
    }

    return NextResponse.json({ status: payment.status, payment })
  } catch (error) {
    console.error("Payment check error:", error)
    return NextResponse.json({ error: "Failed to check payment" }, { status: 500 })
  }
}
