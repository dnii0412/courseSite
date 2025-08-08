import { connectDB } from '@/lib/mongodb'
import { Lesson } from '@/lib/models/lesson'

export async function getLessonById(id: string) {
  try {
    await connectDB()
    const lesson = await Lesson.findById(id).lean()
    
    return JSON.parse(JSON.stringify(lesson))
  } catch (error) {
    console.error('Get lesson error:', error)
    return null
  }
}
