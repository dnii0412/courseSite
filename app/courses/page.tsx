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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Хичээлүүд <span className="text-slate-500 text-lg align-middle">({total})</span></h1>
          <SortSelect />
        </div>

        <SearchBar />
        <AppliedChips />

        <div className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
            {/* Sidebar; applied chips moved above grid to avoid pushing cards */}
            <Filters />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
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

      <Footer />
    </div>
  )
}
