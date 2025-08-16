'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Play, CheckCircle, Lock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Lesson {
  _id: string
  title: string
  duration: number
  videoStatus?: string
  order: number
}

interface Course {
  _id: string
  title: string
  lessons: Lesson[]
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

  const isEnrolled = enrolledCourses.includes(courseId)
  const sortedLessons = course.lessons?.sort((a, b) => a.order - b.order) || []

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {course.title}
        </CardTitle>
        <div className="text-sm text-gray-600">
          {sortedLessons.length} хичээл
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {sortedLessons.map((lesson) => {
            const isCurrentLesson = lesson._id === currentLessonId
            const hasVideo = lesson.videoStatus === 'uploaded'
            const canAccess = isEnrolled || lesson.preview

            return (
              <Link
                key={lesson._id}
                href={`/learn/${courseId}/${lesson._id}`}
                className={`block p-3 rounded-lg border transition-colors ${
                  isCurrentLesson
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'hover:bg-gray-50 border-gray-200'
                } ${!canAccess ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-medium truncate ${
                        isCurrentLesson ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </h4>
                      {isCurrentLesson && (
                        <Badge variant="default" className="text-xs">
                          Одоо
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration} мин</span>
                      </div>
                      
                      {hasVideo ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Play className="w-3 h-3" />
                          <span>Видео</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Clock className="w-3 h-3" />
                          <span>Хүлээгдэж байна</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    {!canAccess && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                    {canAccess && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </Link>
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
