import { Suspense } from 'react'
import { LessonSidebar } from '@/components/learn/lesson-sidebar'
import { getCourseById } from '@/lib/api/courses'
import { notFound } from 'next/navigation'

interface LearnPageProps {
  params: { courseId: string }
}

async function LearnContent({ params }: LearnPageProps) {
  const course = await getCourseById(params.courseId)
  
  if (!course) {
    notFound()
  }

  return <LessonSidebar course={course} />
}

export default function LearnPage({ params }: LearnPageProps) {
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
        <LearnContent params={params} />
      </Suspense>
    </div>
  )
}
