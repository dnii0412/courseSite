import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'
// Ensure all models are registered before we populate them
import '@/lib/models/user'
import '@/lib/models/subcourse'
import '@/lib/models/lesson'

export async function getCourses() {
  try {
    await connectDB()
    const courses = await Course.find({ published: true })
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .lean()
    
    return JSON.parse(JSON.stringify(courses))
  } catch (error) {
    console.error('Get courses error:', error)
    return []
  }
}

export async function getCourseById(id: string) {
  try {
    await connectDB()
    const course = await Course.findById(id).lean()
    
    return JSON.parse(JSON.stringify(course))
  } catch (error) {
    console.error('Get course error:', error)
    return null
  }
}

export async function getCourseWithSubcourses(id: string) {
  try {
    await connectDB()
    const course = await Course.findById(id)
      .populate({
        path: 'subcourses',
        populate: {
          path: 'lessons',
          select: 'title duration videoStatus order'
        }
      })
      .lean()
    
    return JSON.parse(JSON.stringify(course))
  } catch (error) {
    console.error('Get course with subcourses error:', error)
    return null
  }
}

// Alias for backward compatibility
export const getCourseWithLessons = getCourseWithSubcourses

// Alias for backward compatibility
export const getCourse = getCourseById
