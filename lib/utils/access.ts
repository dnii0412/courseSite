import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
  await connectDB()

  // Check only the user's enrolledCourses array
  const user = await User.findById(userId).select('enrolledCourses').lean<{ enrolledCourses?: any[] }>()
  if (!user) return false

  const enrolledIds = (user.enrolledCourses || [])
    .map((entry: any) => {
      if (!entry) return null
      if (typeof entry === 'object') {
        if (entry._id) return entry._id.toString()
        if (typeof (entry as any).toString === 'function') return (entry as any).toString()
        return null
      }
      return entry?.toString?.() || null
    })
    .filter(Boolean) as string[]

  return enrolledIds.includes(courseId.toString())
}
