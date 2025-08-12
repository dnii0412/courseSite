import { CourseCard } from '@/components/courses/course-card'
import { redirect } from 'next/navigation'
import { getUserFromCookies } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
import Navbar from '@/components/Navbar'

interface Course {
  _id: string
  title: string
  description: string
  category?: string
  duration?: number
  instructor?: {
    name: string
  }
  lessons?: any[]
}

export default async function LearnPage() {
  // Require auth
  const currentUser = getUserFromCookies()
  if (!currentUser) {
    redirect('/auth/login?next=/learn')
  }

  await connectDB()
  const userDoc = (await User.findById(currentUser.userId).select('enrolledCourses').lean()) as any
  const allCourseIds = (userDoc?.enrolledCourses || []).map((id: any) => id.toString()) as string[]

  let courses: Course[] = [] as any
  if (allCourseIds.length > 0) {
    const found = await Course.find({ _id: { $in: allCourseIds } }).lean()
    courses = JSON.parse(JSON.stringify(found))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Миний курсууд</h1>
          <p className="text-gray-600">Таны худалдан авч, бүртгүүлсэн сургалтууд</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Та одоогоор ямар нэг курс эзэмшээгүй байна
            </h3>
            <p className="text-gray-600">
              Хамгийн түрүүнд курсийн хуудас руу орж худалдан авалт хийж бүртгүүлнэ үү.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
