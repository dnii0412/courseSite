import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
  await connectDB()

  console.log(`🔐 Checking course access for user ${userId} to course ${courseId}`)

  // Step 1: Get the user document and check if user exists
  const user = await User.findById(userId).select('enrolledCourses').lean<{ enrolledCourses?: any[] }>()
  if (!user) {
    console.log(`❌ User ${userId} not found`)
    return false
  }

  console.log(`👤 User found, enrolledCourses:`, user.enrolledCourses)

  // Step 2: Check if user has enrolledCourses array
  if (!user.enrolledCourses || !Array.isArray(user.enrolledCourses)) {
    console.log(`❌ User has no enrolledCourses array or it's not an array`)
    return false
  }

  // Step 3: Check if enrolledCourses array is empty
  if (user.enrolledCourses.length === 0) {
    console.log(`❌ User's enrolledCourses array is empty`)
    return false
  }

  // Step 4: Extract course IDs from enrolledCourses array
  const enrolledCourseIds = user.enrolledCourses.map((courseRef: any) => {
    // Handle different possible formats of course references
    if (!courseRef) return null
    
    // If it's an ObjectId, convert to string
    if (typeof courseRef === 'object' && courseRef._id) {
      return courseRef._id.toString()
    }
    
    // If it's already a string, use it directly
    if (typeof courseRef === 'string') {
      return courseRef
    }
    
    // If it has a toString method, use it
    if (typeof courseRef.toString === 'function') {
      return courseRef.toString()
    }
    
    return null
  }).filter(Boolean) as string[]

  console.log(`📚 User's enrolled course IDs:`, enrolledCourseIds)
  console.log(`🎯 Checking if course ${courseId} is in enrolled courses`)

  // Step 5: Check if the requested courseId exists in enrolledCourses array
  const hasAccess = enrolledCourseIds.includes(courseId.toString())
  
  console.log(`✅ Access check result: ${hasAccess}`)
  console.log(`📋 Course ${courseId} found in enrolledCourses: ${hasAccess}`)

  return hasAccess
}
