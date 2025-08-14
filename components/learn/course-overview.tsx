'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Lock, CheckCircle, Clock, Users, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

interface CourseOverviewProps {
  courseId: string
}

interface Lesson {
  _id: string
  title: string
  description: string
  duration: number
  videoUrl: string
  isCompleted?: boolean
}

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  price: number
  duration: number
  studentsCount: number
  rating: number
  instructor: {
    name: string
  } | string | null
  lessons?: Lesson[]
}

interface Enrollment {
  _id: string
  progress: number
  completedLessons: string[]
}

export function CourseOverview({ courseId }: CourseOverviewProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const user = session?.user
  const { toast } = useToast()

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`)
        const courseData = await courseResponse.json()

        if (courseResponse.ok) {
          // API may return { course, enrollments } or the course directly
          setCourse(courseData.course || courseData)
        } else {
          throw new Error('Course not found')
        }

        // Check enrollment if user is logged in
        if (user) {
          const enrollmentResponse = await fetch(`/api/enrollments/check/${courseId}`, { cache: 'no-store' })
          if (enrollmentResponse.ok) {
            const enrollmentData = await enrollmentResponse.json()
            if (enrollmentData?.enrolled) {
              setEnrollment(enrollmentData.enrollment)
            } else {
              setEnrollment(null)
            }
          } else {
            setEnrollment(null)
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error)
        toast({
          title: 'Алдаа гарлаа',
          description: 'Хичээлийн мэдээлэл ачаалж чадсангүй',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId, user, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">Хичээл олдсонгүй</h2>
      </div>
    )
  }

  const isEnrolled = Boolean(enrollment)
  const progress = enrollment?.progress ?? 0

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="relative w-48 h-32 rounded-lg overflow-hidden">
              <Image
                src={course.thumbnail || '/placeholder.svg'}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration} цаг
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.studentsCount} сурагч
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Багш: {typeof course.instructor === 'object' && course.instructor?.name
                  ? course.instructor.name
                  : typeof course.instructor === 'string'
                    ? course.instructor
                    : 'Тодорхойгүй'}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enrollment Status */}
      {!isEnrolled && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Энэ хичээлийг үзэхийн тулд бүртгүүлэх шаардлагатай
              </h3>
              <p className="text-orange-700 mb-4">
                Хичээлийг үзэхийн тулд эхлээд төлбөр төлнө үү
              </p>
              <Button asChild>
                <Link href={`/courses/${courseId}`}>
                  Худалдан авах
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {isEnrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Хийгдсэн</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Хичээлүүд ({course.lessons?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(course.lessons ?? []).map((lesson, index) => {
              const isCompleted = enrollment?.completedLessons?.includes(lesson._id)
              const canAccess = isEnrolled || index === 0 // First lesson is free preview

              return (
                <div
                  key={lesson._id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : canAccess ? (
                        <Play className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {index + 1}. {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {lesson.duration} минут
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Дууссан
                      </Badge>
                    )}
                    {canAccess ? (
                      <Button asChild size="sm">
                        <Link href={`/learn/${courseId}/${lesson._id}`}>
                          {isCompleted ? 'Дахин үзэх' : 'Үзэх'}
                        </Link>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Төлбөртэй
                      </Badge>
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
