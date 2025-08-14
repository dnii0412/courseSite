import { CourseOverview } from '@/components/learn/course-overview'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'
import { notFound, redirect } from 'next/navigation'
import { getUserFromCookies } from '@/lib/auth'
import { hasCourseAccess } from '@/lib/utils/access'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

interface CourseLearnPageProps {
  params: {
    courseId: string
  }
}

export default async function CourseLearnPage({ params }: CourseLearnPageProps) {
  await connectDB()
  const course = await Course.findById(params.courseId).lean()

  if (!course) {
    notFound()
  }

  // Server-side access control: only allow users who purchased/enrolled
  const currentUser = getUserFromCookies()
  if (!currentUser) {
    redirect(`/auth/login?next=/learn/${params.courseId}`)
  }

  const allowed = await hasCourseAccess(currentUser.userId, params.courseId)
  if (!allowed) {
    // If not enrolled, send to course page to purchase
    redirect(`/courses/${params.courseId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <CourseOverview courseId={params.courseId} />
      </div>
    </div>
  )
}
