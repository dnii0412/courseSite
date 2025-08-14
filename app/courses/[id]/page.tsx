import { CourseDetails } from '@/components/courses/course-details'
import { getCourse } from '@/lib/api/courses'
import { notFound } from 'next/navigation'

export default async function CoursePage({ params }: { params: { id: string } }) {
  try {
    const course = await getCourse(params.id)

    if (!course) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <CourseDetails course={course} />
      </div>
    )
  } catch (error) {
    console.error('Error loading course:', error)
    notFound()
  }
}
