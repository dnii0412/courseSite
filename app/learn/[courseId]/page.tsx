import { CourseOverview } from '@/components/learn/course-overview'
import { getCourseWithLessons } from '@/lib/api/courses'
import { notFound } from 'next/navigation'

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseWithLessons(params.courseId)

  if (!course) {
    notFound()
  }

  return <CourseOverview course={course} />
}
