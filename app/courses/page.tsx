import { CourseCard } from '@/components/courses/course-card'
import { getCourses } from '@/lib/api/courses'

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1B3C53] mb-8">Хичээлүүд</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
