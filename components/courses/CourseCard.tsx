'use client'

import Link from 'next/link'

export type CourseCardProps = {
  course: {
    _id: string
    slug?: string
    title: string
    description?: string
    thumbnail?: string
    category?: string
    price: number
    duration?: number // minutes
    lessons?: { _id: string }[]
    instructor?: { name?: string }
    rating?: number
    studentsCount?: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const href = course.slug ? `/courses/${course.slug}` : `/courses/${course._id}`
  const isFree = course.price === 0
  const hours = Math.max(1, Math.round((course.duration || 0) / 60))
  const lessons = course.lessons?.length || 0

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] bg-slate-100">
          {course.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">No Image</div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            {course.category && (
              <span className="inline-flex rounded-full bg-white/95 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-[#1B3C53] ring-1 ring-slate-200 shadow-sm">
                {course.category}
              </span>
            )}
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold ring-1 shadow-sm ${
              isFree 
                ? 'bg-green-100 text-green-800 ring-green-300' 
                : 'bg-[#456882] text-white ring-[#456882]'
            }`}>
              {isFree ? 'Үнэгүй' : `${course.price.toLocaleString()}₮`}
            </span>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 lg:p-5 space-y-2 sm:space-y-3">
          {/* Title */}
          <h3 className="text-[#1B3C53] line-clamp-2 font-bold text-sm sm:text-base lg:text-lg group-hover:text-[#456882] transition-colors leading-tight">
            {course.title}
          </h3>
          
          {/* Instructor */}
          {course.instructor?.name && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#456882]">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium truncate">{course.instructor.name}</span>
            </div>
          )}
          
          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-[#456882]">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="font-semibold">{Number(course.rating || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="font-semibold">{course.studentsCount || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{hours}ц</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-semibold">{lessons}</span>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="pt-2">
            <span className="inline-flex w-full justify-center rounded-xl bg-[#456882] text-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold group-hover:bg-[#1B3C53] transition-colors duration-200">
              Дэлгэрэнгүй
            </span>
          </div>
        </div>
      </Link>
    </div>
  )}

export default CourseCard


