import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star } from 'lucide-react'

interface Course {
    id: string
    title: string
    description: string
    thumbnail: string
    price: number
    duration: number
    category: string
    level: string
    studentsCount: number
    rating: number
    instructor: {
        name: string
    }
    createdAt: Date
}

interface EnhancedCourseCardProps {
    course: Course
}

const categoryLabels: Record<string, string> = {
    technology: 'Технологи',
    business: 'Бизнес',
    design: 'Дизайн',
    marketing: 'Маркетинг',
    other: 'Бусад'
}

const levelLabels: Record<string, string> = {
    beginner: 'Эхлэгч',
    intermediate: 'Дунд',
    advanced: 'Дээд'
}

export function EnhancedCourseCard({ course }: EnhancedCourseCardProps) {
    const isNew = new Date(course.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
    const isFree = course.price === 0

    return (
        <Link
            href={`/courses/${course.id}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded-2xl"
        >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="aspect-video overflow-hidden rounded-xl">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <div className="text-slate-400 text-4xl font-bold">
                                {course.title.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isFree && (
                            <Badge className="bg-green-500 text-white hover:bg-green-600">
                                Үнэгүй
                            </Badge>
                        )}
                        {isNew && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                Шинэ
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Category and Level */}
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {categoryLabels[course.category] || course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {levelLabels[course.level] || course.level}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700 transition-colors">
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 line-clamp-2">
                        {course.description}
                    </p>

                    {/* Instructor */}
                    <p className="text-sm text-slate-500">
                        {course.instructor?.name || 'Мэдэгдэхгүй'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}ц</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{course.studentsCount}</span>
                            </div>
                        </div>

                        {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{course.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    {!isFree && (
                        <div className="pt-2 border-t border-slate-100">
                            <p className="text-lg font-semibold text-slate-900">
                                ₮{course.price.toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
