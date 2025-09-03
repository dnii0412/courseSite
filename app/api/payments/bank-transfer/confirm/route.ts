import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth-server"
import { auth } from "@/auth"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
    try {
        // Check for NextAuth session first, then custom auth token
        const session = await auth()
        let user = null

        if (session?.user) {
            // NextAuth user - check if admin
            const db = Database.getInstance()
            const dbUser = await db.getUserById(new ObjectId(session.user.id))
            if (dbUser && dbUser.role === "admin") {
                user = {
                    id: session.user.id!,
                    email: session.user.email!,
                    name: session.user.name!,
                    role: "admin"
                }
            }
        } else {
            // Custom auth token
            const token = request.cookies.get("auth-token")?.value
            if (token) {
                user = verifyToken(token)
            }
        }

        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 })
        }

        const { paymentId, transactionReference } = await request.json()

        if (!paymentId) {
            return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
        }

        // Get payment details
        const client = await (await import("@/lib/mongodb")).default
        const db_conn = client.db("new-era-platform")

        const payment = await db_conn.collection("payments").findOne({
            _id: new ObjectId(paymentId),
            paymentMethod: "bank_transfer",
            status: "pending"
        })

        if (!payment) {
            return NextResponse.json({ error: "Bank transfer payment not found" }, { status: 404 })
        }

        // Use MongoDB transactions for atomic operations
        const mongoSession = client.startSession()

        try {
            await mongoSession.withTransaction(async () => {
                // Update payment status
                await db_conn.collection("payments").updateOne(
                    { _id: new ObjectId(paymentId) },
                    {
                        $set: {
                            status: "completed",
                            bankTransferReference: transactionReference || payment.bankTransferReference,
                            updatedAt: new Date()
                        }
                    },
                    { session: mongoSession }
                )

                // Create enrollment
                await db_conn.collection("enrollments").insertOne({
                    userId: payment.userId,
                    courseId: payment.courseId,
                    paymentId: new ObjectId(paymentId),
                    enrolledAt: new Date(),
                    completedLessons: [],
                    progress: 0,
                    isActive: true,
                }, { session: mongoSession })

                // Update user's enrolledCourses array
                await db_conn.collection("users").updateOne(
                    { _id: payment.userId },
                    { $addToSet: { enrolledCourses: payment.courseId.toString() } },
                    { session: mongoSession }
                )
            })
        } finally {
            await mongoSession.endSession()
        }

        return NextResponse.json({
            success: true,
            message: "Bank transfer payment confirmed and user enrolled"
        })

    } catch (error) {
        console.error("Bank transfer confirmation error:", error)
        return NextResponse.json({
            error: "Failed to confirm bank transfer payment",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}
