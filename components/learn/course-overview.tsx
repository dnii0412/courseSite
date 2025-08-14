"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, BookOpen, CheckCircle, Play, Lock } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  _id: string
  title: string
  duration: number
  isCompleted?: boolean
  isLocked?: boolean
}

interface Course {
  _id: string
  title: string
  description: string
  lessons: Lesson[]
  totalDuration: number
  completedLessons: number
}

interface CourseOverviewProps {
  course: Course
}

export function CourseOverview({ course }: CourseOverviewProps) {
  const { data: session } = useSession()
  const [currentLesson, setCurrentLesson] = useState<string | null>(null)

  useEffect(() => {
    // Find the first incomplete lesson or set to first lesson
    const firstIncompleteLesson = course.lessons.find(lesson => !lesson.isCompleted)
    if (firstIncompleteLesson) {
      setCurrentLesson(firstIncompleteLesson._id)
    } else if (course.lessons.length > 0) {
      setCurrentLesson(course.lessons[0]._id)
    }
  }, [course.lessons])

  const progressPercentage = course.lessons.length > 0
    ? (course.completedLessons / course.lessons.length) * 100
    : 0

  const handleLessonClick = (lessonId: string) => {
    setCurrentLesson(lessonId)
  }

  const handleContinueLearning = () => {
    if (currentLesson) {
      window.location.href = `/learn/${course._id}/${currentLesson}`
    }
  }

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Нэвтрэх шаардлагатай</p>
        <Button asChild>
          <Link href="/auth/login">Нэвтрэх</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>

        {/* Progress Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Хичээлийн явц</h3>
              <span className="text-sm text-gray-600">
                {course.completedLessons} / {course.lessons.length} хичээл
              </span>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{Math.round(progressPercentage)}% дууссан</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(course.totalDuration / 60)} цаг</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons.length} хичээл</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Learning Button */}
        {currentLesson && (
          <Button
            onClick={handleContinueLearning}
            className="w-full md:w-auto mb-6"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Сургалтаа үргэлжлүүлэх
          </Button>
        )}
      </div>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle>Хичээлүүд</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const isCurrentLesson = lesson._id === currentLesson
              const isCompleted = lesson.isCompleted
              const isLocked = lesson.isLocked

              return (
                <div
                  key={lesson._id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border transition-colors
                    ${isCurrentLesson ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}
                    ${isCompleted ? 'bg-green-50 border-green-200' : ''}
                    ${isLocked ? 'bg-gray-50 border-gray-200' : 'hover:bg-gray-50 cursor-pointer'}
                  `}
                  onClick={() => !isLocked && handleLessonClick(lesson._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration} мин</span>
                        {isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            Дууссан
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Play className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
