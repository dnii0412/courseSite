'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Play, CheckCircle, Lock, ChevronRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Lesson {
  _id: string
  title: string
  duration: number
  videoStatus?: string
  order: number
  isCompleted?: boolean
  preview?: boolean
}

interface Subcourse {
  _id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Course {
  _id: string
  title: string
  subcourses: Subcourse[]
}

interface LessonSidebarProps {
  courseId: string
  currentLessonId: string
  course: Course
}

export function LessonSidebar({ courseId, currentLessonId, course }: LessonSidebarProps) {
  const { data: session } = useSession()
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSubcourses, setExpandedSubcourses] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/enrollments/check/${courseId}`)
        const data = await response.json()
        
        if (data.enrolled) {
          setEnrolledCourses([courseId])
        }
      } catch (error) {
        console.error('Error checking enrollment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnrollment()
  }, [courseId, session?.user?.id])

  const toggleSubcourse = (subcourseId: string) => {
    setExpandedSubcourses(prev => ({
      ...prev,
      [subcourseId]: !prev[subcourseId]
    }))
  }

  const isEnrolled = enrolledCourses.includes(courseId)
  const sortedSubcourses = course.subcourses?.sort((a, b) => a.order - b.order) || []

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {course.title}
        </CardTitle>
        <div className="text-sm text-gray-600">
          {sortedSubcourses.length} модуль
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {sortedSubcourses.map((subcourse) => {
            const isExpanded = expandedSubcourses[subcourse._id]
            const lessonsCount = subcourse.lessons?.length || 0
            const completedLessons = subcourse.lessons?.filter(l => l.isCompleted)?.length || 0
            const progressPercentage = lessonsCount > 0 ? Math.round((completedLessons / lessonsCount) * 100) : 0

            return (
              <div key={subcourse._id} className="border border-gray-200 rounded-lg">
                {/* Subcourse Header */}
                <button
                  onClick={() => toggleSubcourse(subcourse._id)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {subcourse.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{lessonsCount} хичээл</span>
                        <span>•</span>
                        <span>{progressPercentage}%</span>
                      </div>
                    </div>
                    <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-2 space-y-1">
                      {subcourse.lessons?.sort((a, b) => a.order - b.order).map((lesson) => {
                        const isCurrentLesson = lesson._id === currentLessonId
                        const hasVideo = lesson.videoStatus === 'uploaded'
                        const canAccess = isEnrolled || lesson.preview

                        return (
                          <Link
                            key={lesson._id}
                            href={`/learn/${courseId}/${lesson._id}`}
                            className={`block p-2 rounded transition-colors ${
                              isCurrentLesson
                                ? 'bg-blue-100 text-blue-900'
                                : 'hover:bg-gray-100'
                            } ${!canAccess ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className={`text-xs font-medium truncate ${
                                    isCurrentLesson ? 'text-blue-900' : 'text-gray-900'
                                  }`}>
                                    {lesson.title}
                                  </h5>
                                  {isCurrentLesson && (
                                    <Badge variant="default" className="text-xs px-1 py-0">
                                      Одоо
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.duration || 0} мин</span>
                                  </div>
                                  
                                  {lesson.isCompleted && (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 ml-2">
                                {!canAccess && (
                                  <Lock className="w-3 h-3 text-gray-400" />
                                )}
                                {hasVideo && (
                                  <Play className="w-3 h-3 text-green-600" />
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {!isEnrolled && !isLoading && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">Курсд бүртгүүлэх</div>
              <div className="text-xs">
                Бүх хичээлийг харахын тулд курсд бүртгүүлнэ үү
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
