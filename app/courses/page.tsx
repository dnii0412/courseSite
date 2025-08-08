import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CourseCard } from '@/components/courses/course-card'
import { getCourses } from '@/lib/api/courses'

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Бүх хичээлүүд
          </h1>
          <p className="text-gray-600">
            Та өөрт тохирох хичээлээ сонгоод суралцаж эхлээрэй
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
