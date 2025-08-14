import { Footer } from '@/components/layout/footer'
import Navbar from '@/components/Navbar'
import CourseCard from '@/components/courses/CourseCard'
import SearchBar from '@/components/courses/SearchBar'
import SortSelect from '@/components/courses/SortSelect'
import Filters from '@/components/courses/Filters'
import AppliedChips from '@/components/courses/AppliedChips'
import SkeletonCard from '@/components/courses/SkeletonCard'
import EmptyState from '@/components/ui/EmptyState'
import { Suspense } from 'react'
import { headers } from 'next/headers'

async function fetchCourses(searchParams: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(searchParams).forEach(([k, v]) => {
    if (typeof v === 'string') qs.set(k, v)
  })
  const h = headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || 'http'
  const base = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`
  const url = `${base}/api/courses?${qs.toString()}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return { data: [], total: 0, page: 1, pageSize: 12 }
  return res.json()
}

export default async function CoursesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { data, total } = await fetchCourses(searchParams)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden">
        <div className="px-4 py-6">
          {/* Mobile Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1B3C53] mb-3">Хичээлүүд</h1>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#456882] font-medium">{total} хичээл</span>
            </div>
          </div>

          {/* Mobile Search & Filters */}
          <div className="space-y-4 mb-6">
            <SearchBar />
            <AppliedChips />
            <Filters />
          </div>

          {/* Mobile Course Grid */}
          <div className="grid grid-cols-1 gap-4">
            {data.length === 0 ? (
              <EmptyState />
            ) : (
              data.map((course: any) => <CourseCard key={course._id} course={course} />)
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Desktop Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Хичээлүүд <span className="text-slate-500 text-lg align-middle">({total})</span></h1>
            <SortSelect />
          </div>

          <SearchBar />
          <AppliedChips />

          <div className="mt-6">
            <div className="grid grid-cols-[280px,1fr] gap-6">
              <Filters />
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {data.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState />
                  </div>
                ) : (
                  data.map((course: any) => <CourseCard key={course._id} course={course} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
