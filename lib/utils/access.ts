import { connectDB } from '@/lib/mongodb'
import { Enrollment } from '@/lib/models/enrollment'
import { User } from '@/lib/models/user'

export async function hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
  await connectDB()

  // Check enrollment collection first
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId }).lean()
  if (enrollment) return true

  // Fallback: check user's enrolledCourses array
  const user = await User.findById(userId).select('enrolledCourses').lean<{ enrolledCourses?: any[] }>()
  if (!user) return false

  // enrolledCourses may be ObjectId array; compare as strings
  const enrolledIds = (user.enrolledCourses || []).map((entry: any) => {
    if (!entry) return null
    // If populated object
    if (typeof entry === 'object') {
      if (entry._id) return entry._id.toString()
      // In rare cases Mongoose ObjectId has toString
      if (typeof (entry as any).toString === 'function') return (entry as any).toString()
      return null
    }
    // If plain ObjectId or string
    return entry?.toString?.() || null
  }).filter(Boolean) as string[]
  return enrolledIds.includes(courseId.toString())
}
