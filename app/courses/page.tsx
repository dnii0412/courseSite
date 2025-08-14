import { Suspense } from 'react'
import { CourseCard } from '@/components/courses/course-card'
import { SearchBar } from '@/components/courses/SearchBar'
import { Filters } from '@/components/courses/Filters'
import { SortSelect } from '@/components/courses/SortSelect'
import { SkeletonCard } from '@/components/courses/SkeletonCard'
import { getCourses } from '@/lib/api/courses'
import { Course } from '@/lib/models/course'

interface CoursesPageProps {
  searchParams: {
    search?: string
    category?: string
    level?: string
    sort?: string
  }
}

async function CoursesContent({ searchParams }: CoursesPageProps) {
  const courses = await getCourses(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Бүх хичээлүүд</h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar />
          <Filters />
          <SortSelect />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course: Course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default function CoursesPage({ searchParams }: CoursesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }>
        <CoursesContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
