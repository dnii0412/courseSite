import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CourseDetails } from '@/components/courses/course-details'
import { getCourseById } from '@/lib/api/courses'
import { notFound } from 'next/navigation'

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseById(params.id)
  
  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CourseDetails course={course} />
      <Footer />
    </div>
  )
}
