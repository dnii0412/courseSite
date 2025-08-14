import { CourseDetails } from '@/components/courses/course-details'
import { getCourse } from '@/lib/api/courses'
import { notFound } from 'next/navigation'

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  return <CourseDetails course={course} />
}
