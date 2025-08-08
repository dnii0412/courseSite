'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, PlayCircle, Lock } from 'lucide-react'

interface Lesson {
  _id: string
  title: string
  duration: number
  isCompleted?: boolean
}

interface Course {
  _id: string
  title: string
  lessons: Lesson[]
}

interface LessonSidebarProps {
  course: Course
  currentLessonId: string
}

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {
  const router = useRouter()
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    // Fetch completed lessons for this course
    const fetchCompletedLessons = async () => {
      try {
        const response = await fetch(`/api/enrollments/check/${course._id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.enrollment?.completedLessons) {
            setCompletedLessons(data.enrollment.completedLessons.map((l: any) => l.lesson))
          }
        }
      } catch (error) {
        console.error('Error fetching completed lessons:', error)
      }
    }

    fetchCompletedLessons()
  }, [course._id])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`
  }

  const handleLessonClick = (lessonId: string) => {
    router.push(`/learn/${course._id}/${lessonId}`)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {course.title}
        </h2>
        
        <div className="space-y-2">
          {course.lessons?.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson._id)
            const isCurrent = lesson._id === currentLessonId
            
            return (
              <Card 
                key={lesson._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleLessonClick(lesson._id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {index + 1}. {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDuration(lesson.duration)}
                        </p>
                      </div>
                    </div>
                    
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        Дууссан
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Нийт хичээл:</span>
            <span>{course.lessons?.length || 0}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Дууссан:</span>
            <span>{completedLessons.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
