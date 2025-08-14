import { LessonSidebar } from '@/components/learn/lesson-sidebar'

export default function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LessonSidebar courseId={params.courseId} lessonId={params.lessonId} />
    </div>
  )
}
