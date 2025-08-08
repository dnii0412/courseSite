import { connectDB } from '@/lib/mongodb'
import { Enrollment } from '@/lib/models/enrollment'
import { User } from '@/lib/models/user'

export async function hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
  await connectDB()

  // Check enrollment collection first
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId }).lean()
  if (enrollment) return true

  // Fallback: check user's enrolledCourses array
  const user = await User.findById(userId).select('enrolledCourses').lean()
  if (!user) return false

  // enrolledCourses may be ObjectId array; compare as strings
  const enrolledIds = (user.enrolledCourses || []).map((id: any) => id.toString())
  return enrolledIds.includes(courseId.toString())
}
