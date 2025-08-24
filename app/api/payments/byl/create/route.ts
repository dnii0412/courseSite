import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { bylService } from "@/lib/byl"

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

    const { courseId, paymentMethod = "checkout" } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Get course details
    const course = await db.getCourseById(new ObjectId(courseId))
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (paymentMethod === "checkout") {
      // Create Byl checkout
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      const checkoutData = {
        success_url: `${baseUrl}/payment-success?paymentId=`,
        cancel_url: `${baseUrl}/courses/${courseId}`,
        items: [
          {
            price_data: {
              unit_amount: course.price,
              product_data: {
                name: course.title,
                client_reference_id: courseId
              }
            },
            quantity: 1
          }
        ],
        phone_number_collection: true,
        customer_email: user.email,
        client_reference_id: courseId
      }

      const bylCheckout = await bylService.createCheckout(checkoutData)

      // Create payment record
      const paymentId = await db.createPayment({
        userId: new ObjectId(user.id),
        courseId: new ObjectId(courseId),
        amount: course.price,
        currency: "MNT",
        status: "pending",
        paymentMethod: "byl",
        bylCheckoutId: bylCheckout.id
      })

      // Update payment with Byl checkout ID
      await db.updatePaymentStatus(paymentId, "pending", bylCheckout.id.toString(), "byl")

      return NextResponse.json({
        paymentId: paymentId.toString(),
        bylCheckout,
        success: true
      })
    } else {
      // Create Byl invoice
      const description = `New Era - ${course.title}`
      const bylInvoice = await bylService.createInvoice(course.price, description)

      // Create payment record
      const paymentId = await db.createPayment({
        userId: new ObjectId(user.id),
        courseId: new ObjectId(courseId),
        amount: course.price,
        currency: "MNT",
        status: "pending",
        paymentMethod: "byl",
        bylInvoiceId: bylInvoice.id
      })

      return NextResponse.json({
        paymentId: paymentId.toString(),
        bylInvoice,
        success: true
      })
    }
  } catch (error) {
    console.error("Byl payment creation error:", error)
    return NextResponse.json({ error: "Failed to create Byl payment" }, { status: 500 })
  }
}
