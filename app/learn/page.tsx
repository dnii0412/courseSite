import { CourseOverview } from '@/components/learn/course-overview'
import { getCourses } from '@/lib/api/courses'

export default async function LearnPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B3C53] mb-4">
            Миний сургалтууд
          </h1>
          <p className="text-[#456882]">
            Таны бүртгүүлсэн хичээлүүд
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#456882] mb-4">
              Та одоогоор ямар нэг хичээлд бүртгүүлээгүй байна
            </p>
            <a
              href="/courses"
              className="inline-block bg-[#456882] text-white px-6 py-3 rounded-lg hover:bg-[#1B3C53] transition-colors"
            >
              Хичээлүүд үзэх
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseOverview key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
