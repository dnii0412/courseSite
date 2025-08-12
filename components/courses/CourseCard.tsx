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
    <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] bg-slate-100">
          {course.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">No Image</div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {course.category && (
              <span className="inline-flex rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{course.category}</span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ${isFree ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-sky-50 text-sky-700 ring-sky-200'}`}>
              {isFree ? 'Үнэгүй' : `${course.price.toLocaleString()}₮`}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-2">
          <h3 className="text-slate-900 line-clamp-2 font-semibold text-lg group-hover:text-sky-700 transition-colors">{course.title}</h3>
          {course.instructor?.name && (
            <div className="text-sm text-slate-600">{course.instructor.name}</div>
          )}
          <div className="flex items-center justify-between text-[13px] text-slate-600">
            <div className="flex items-center gap-2">
              <span>★ {Number(course.rating || 0).toFixed(1)}</span>
              <span>• {course.studentsCount || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{hours}ц</span>
              <span>• {lessons} хичээл</span>
            </div>
          </div>
          <div className="pt-3">
            <span className="inline-flex rounded-xl bg-slate-900 text-white px-4 py-2 text-sm group-hover:bg-slate-800">Дэлгэрэнгүй</span>
          </div>
        </div>
      </Link>
    </div>
  )}

export default CourseCard


