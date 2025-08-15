import { Suspense } from 'react'
import { CourseCard } from '@/components/courses/course-card'
import { SearchBar } from '@/components/courses/SearchBar'
import { SortSelect } from '@/components/courses/SortSelect'
import { SkeletonCard } from '@/components/courses/SkeletonCard'
import { Footer } from '@/components/layout/footer'
import { getCourses } from '@/lib/api/courses'

interface CoursesPageProps {
  searchParams: {
    search?: string
    category?: string
    level?: string
    sort?: string
  }
}

async function CoursesContent({ searchParams }: CoursesPageProps) {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Бүх хичээлүүд</h1>
          
          {/* Search and Sort Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar />
            </div>
            <div className="w-full lg:w-48">
              <SortSelect />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Course Grid */}
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
            
            {courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Хичээл олдсонгүй</p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function CoursesPage({ searchParams }: CoursesPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Skeleton */}
        <div className="mt-16">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <CoursesContent searchParams={searchParams} />
    </Suspense>
  )
}
