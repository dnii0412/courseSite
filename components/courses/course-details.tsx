"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, BookOpen, Star, Play, CheckCircle } from 'lucide-react'
import { PaymentModal } from '@/components/payments/payment-modal'

interface CourseDetailsProps {
  course: {
    _id: string
    title: string
    description: string
    price: number
    duration: string
    level: string
    rating: number
    enrolledCount: number
    lessonCount: number
    image?: string
    category: string
    lessons?: Array<{
      _id: string
      title: string
      duration: number
    }>
  }
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const { data: session } = useSession()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!session?.user) {
        setIsCheckingEnrollment(false)
        return
      }

      try {
        const response = await fetch('/api/users/enrollments')
        if (response.ok) {
          const enrollments = await response.json()
          const isEnrolledInCourse = enrollments.some(
            (enrollment: any) => enrollment.courseId === course._id
          )
          setIsEnrolled(isEnrolledInCourse)
        }
      } catch (error) {
        console.error('Error checking enrollment:', error)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    checkEnrollment()
  }, [session?.user, course._id])

  const handleContinueCourse = () => {
    if (isEnrolled) {
      window.location.href = `/learn/${course._id}`
    }
  }

  if (isCheckingEnrollment) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.enrolledCount} сурагч</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessonCount} хичээл</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
          </div>

          {/* Course Image */}
          {course.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Course Description */}
          <Card>
            <CardHeader>
              <CardTitle>Хичээлийн тайлбар</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Course Lessons */}
          {course.lessons && course.lessons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Хичээлүүд</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration} мин</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Card */}
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₮{course.price.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Нэг удаагийн төлбөр</p>
              </div>

              {isEnrolled ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full mb-3"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Сургалтаа үргэлжлүүлэх
                </Button>
              ) : (
                <PaymentModal
                  courseId={course._id}
                  courseTitle={course.title}
                  price={course.price}
                  onSuccess={() => setIsEnrolled(true)}
                />
              )}

              {isEnrolled && (
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Бүртгэлтэй</span>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Хичээлийн тоо:</span>
                  <span className="font-medium">{course.lessonCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Үргэлжлэх хугацаа:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Түвшин:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Категори:</span>
                  <span className="font-medium">{course.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
