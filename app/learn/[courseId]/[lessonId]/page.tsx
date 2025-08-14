import { getLesson } from '@/lib/api/lessons'
import { notFound } from 'next/navigation'

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLesson(params.lessonId)

  if (!lesson) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
        <div className="prose max-w-none">
          {lesson.content}
        </div>
      </div>
    </div>
  )
}
