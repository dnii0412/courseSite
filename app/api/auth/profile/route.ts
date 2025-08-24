import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-server"
import { db } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user details
    const userDetails = await db.getUserById(new ObjectId(user.id))
    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user enrollments
    const enrollments = await db.getUserEnrollments(new ObjectId(user.id))
    
    // Get course details for each enrollment
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        try {
          const course = await db.getCourseById(new ObjectId(enrollment.courseId))
          if (course) {
            return {
              courseId: enrollment.courseId,
              course: course,
              progress: enrollment.progress || 0,
              enrolledAt: enrollment.enrolledAt,
              isActive: enrollment.isActive
            }
          }
          return null
        } catch (error) {
          console.error("Error fetching course:", error)
          return null
        }
      })
    )

    // Filter out null values
    const validEnrollments = coursesWithProgress.filter(item => item !== null)

    // Calculate stats
    const stats = {
      totalCourses: validEnrollments.length,
      completedCourses: validEnrollments.filter((e: any) => e.progress === 100).length,
      totalHours: Math.round(validEnrollments.reduce((acc: number, e: any) => acc + (e.course.duration || 0), 0) / 60),
      certificates: validEnrollments.filter((e: any) => e.progress === 100).length
    }

    return NextResponse.json({
      user: {
        id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
        createdAt: userDetails.createdAt,
        updatedAt: userDetails.updatedAt
      },
      enrollments: validEnrollments,
      stats
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, newPassword, confirmPassword } = body

    // Validate password if provided
    if (newPassword || confirmPassword) {
      if (!newPassword || !confirmPassword) {
        return NextResponse.json({ error: "Both password fields are required" }, { status: 400 })
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: any = { name, email }
    if (phone !== undefined) updateData.phone = phone
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      // Hash the new password
      const bcrypt = await import('bcryptjs')
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Update user in database
    const success = await db.updateUser(new ObjectId(user.id), updateData)

    if (success) {
      return NextResponse.json({ message: "Profile updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
