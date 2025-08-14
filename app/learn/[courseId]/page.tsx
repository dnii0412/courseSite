import { CourseOverview } from '@/components/learn/course-overview'

export default function LearnCoursePage({ params }: { params: { courseId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <CourseOverview courseId={params.courseId} />
    </div>
  )
}
