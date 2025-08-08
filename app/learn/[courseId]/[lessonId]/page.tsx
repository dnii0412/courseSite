import { Navbar } from '@/components/layout/navbar'
import { VideoPlayer } from '@/components/video/video-player'
import { LessonSidebar } from '@/components/learn/lesson-sidebar'
import { QuizModal } from '@/components/quiz/quiz-modal'
import { getCourseById } from '@/lib/api/courses'
import { getLessonById } from '@/lib/api/lessons'
import { notFound, redirect } from 'next/navigation'
import { getUserFromCookies } from '@/lib/auth'
import { hasCourseAccess } from '@/lib/utils/access'

interface LearnPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function LearnPage({ params }: LearnPageProps) {
  const [course, lesson] = await Promise.all([
    getCourseById(params.courseId),
    getLessonById(params.lessonId)
  ])

  if (!course || !lesson) {
    notFound()
  }

  // Server-side access control: only allow users who purchased/enrolled
  const currentUser = getUserFromCookies()
  if (!currentUser) {
    redirect(`/auth/login?next=/learn/${params.courseId}/${params.lessonId}`)
  }

  const allowed = await hasCourseAccess(currentUser.userId, params.courseId)
  if (!allowed) {
    redirect(`/courses/${params.courseId}`)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <div className="flex-1">
          <VideoPlayer 
            videoUrl={lesson.videoUrl}
            title={lesson.title}
            courseId={params.courseId}
            lessonId={params.lessonId}
          />
        </div>
        
        <LessonSidebar 
          course={course}
          currentLessonId={params.lessonId}
        />
      </div>

      <QuizModal 
        lessonId={params.lessonId}
        quiz={lesson.quiz}
      />
    </div>
  )
}
