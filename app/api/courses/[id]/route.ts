import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { db } from "@/lib/database"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const course = await db.getCourseById(new ObjectId(id))
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Fetch sub-courses for this course
    const subCourses = await db.getSubCoursesByCourseId(new ObjectId(id))

    // Fetch lessons for all sub-courses
    let allLessons: any[] = []
    if (subCourses && subCourses.length > 0) {
      for (const subCourse of subCourses) {
        const lessons = await db.getLessonsBySubCourseId(new ObjectId(subCourse._id))
        if (lessons && lessons.length > 0) {
          allLessons.push(...lessons)
        }
      }
    }
    
    // Combine course with lessons
    const courseWithLessons = {
      ...course,
      lessons: allLessons || []
    }

    return NextResponse.json({ course: courseWithLessons })
  } catch (error) {
    
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}
