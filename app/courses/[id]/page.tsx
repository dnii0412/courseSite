import { Suspense } from 'react'
import { CourseDetails } from '@/components/courses/course-details'
import { getCourseById } from '@/lib/api/courses'
import { notFound } from 'next/navigation'

interface CoursePageProps {
  params: { id: string }
}

async function CourseContent({ params }: CoursePageProps) {
  const course = await getCourseById(params.id)
  
  if (!course) {
    notFound()
  }

  return <CourseDetails course={course} />
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <CourseContent params={params} />
      </Suspense>
    </div>
  )
}
