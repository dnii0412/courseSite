"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PaymentModal } from "@/components/payment-modal"
import { Play, Clock, Star, Users, Check, BookOpen } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Course } from "@/lib/types"
import Link from "next/link"

interface EnrolledCourse {
  courseId: string
  enrolledAt: string
  isActive: boolean
}

export default function CoursePage() {
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [subCourses, setSubCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course
        const courseResponse = await fetch(`/api/courses/${params.id}`)
        const courseData = await courseResponse.json()
        setCourse(courseData.course)

        // Fetch sub-courses for this course
        try {
          const subCoursesResponse = await fetch(`/api/sub-courses?courseId=${params.id}`)
          if (subCoursesResponse.ok) {
            const subCoursesData = await subCoursesResponse.json()
            setSubCourses(subCoursesData.subCourses || [])
          }
        } catch (error) {
    
        }

        // Fetch user enrollments if logged in
        if (user) {
          try {
            const enrollmentsResponse = await fetch("/api/auth/enrollments")
            if (enrollmentsResponse.ok) {
              const enrollmentsData = await enrollmentsResponse.json()
              setEnrolledCourses(enrollmentsData.enrollments || [])
            }
          } catch (error) {
      
          }
        }
      } catch (error) {
  
      } finally {
        setLoading(false)
      }
    }

    if (params.id && !authLoading) {
      fetchData()
    }
  }, [params.id, user, authLoading])

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(enrollment => 
      enrollment.courseId === courseId && enrollment.isActive
    )
  }

  const hasAccess = (courseId: string) => {
    // Admin has access to all courses
    if (user?.role === 'admin') {
      return true
    }
    // Regular users need to be enrolled
    return isEnrolled(courseId)
  }

  const getCourseButton = () => {
    if (!user) {
      return (
        <Button asChild className="w-full bg-primary hover:bg-primary/90 mb-4" size="lg">
          <Link href="/login">Нэвтрэх</Link>
        </Button>
      )
    }

    if (hasAccess(course?._id || '')) {
      return (
        <Button asChild className="w-full bg-green-600 hover:bg-green-700 mb-4" size="lg">
          <Link href={`/courses/${course?._id}/learn`}>
            <BookOpen className="w-4 h-4 mr-2" />
            Үргэлжлүүлэх
          </Link>
        </Button>
      )
    }

    return (
      <Button
        onClick={() => setShowPaymentModal(true)}
        className="w-full bg-primary hover:bg-primary/90 mb-4"
        size="lg"
      >
        Төлбөр төлөх
      </Button>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading course...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Course not found</div>
        </div>
      </div>
    )
  }

  const userHasAccess = hasAccess(course._id || '')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledCount} оролц</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>{course.lessons?.length || 0} хичээл</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{subCourses.length} хэсэг</span>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
                {userHasAccess && (
                  <Badge className="bg-green-600 text-white">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Бүртгэлтэй
                  </Badge>
                )}
              </div>
            </div>

            {/* Course Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Хичээлийн тайлбар</h2>
                <p className="text-gray-600">{course.description}</p>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Хичээлийн бүтэц</h2>
                <div className="space-y-4">
                  {subCourses && subCourses.length > 0 ? (
                    subCourses.map((subCourse) => (
                      <div key={subCourse._id} className="space-y-3">
                        {/* Sub-course header */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{subCourse.title}</h3>
                            <p className="text-sm text-gray-600">{subCourse.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.lessons?.filter(lesson => lesson.subCourseId === subCourse._id).length || 0} хичээл
                          </div>
                        </div>
                        
                        {/* Lessons under this sub-course */}
                        <div className="ml-8 space-y-2">
                          {course.lessons
                            ?.filter(lesson => lesson.subCourseId === subCourse._id)
                            .sort((a, b) => a.order - b.order)
                            .map((lesson, index) => (
                              <div
                                key={lesson._id?.toString() || index}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                                  {lesson.order}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{lesson.title}</h4>
                                  <p className="text-xs text-gray-600">{lesson.description}</p>
                                </div>
                                <div className="text-xs text-gray-500">{lesson.duration} мин</div>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                  ) : course.lessons && course.lessons.length > 0 ? (
                    // Fallback: show lessons without sub-courses
                    <div className="space-y-3">
                      <div className="text-sm text-gray-500 mb-3">Хичээлүүд:</div>
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson._id?.toString() || index}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{lesson.title}</h3>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">{lesson.duration} мин</div>
                          {lesson.isPreview && (
                            <Badge variant="outline" className="text-xs">
                              Preview
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Course content will be available after enrollment.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-primary" />
                </div>

                {userHasAccess ? (
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-green-600 mb-2">✅ Бүртгэлтэй</div>
                    <div className="text-sm text-gray-600">Та энэ хичээлийг үзэх боломжтой</div>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">₮{course.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Нэг удаагийн төлбөр</div>
                  </div>
                )}

                {getCourseButton()}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Хичээлийн тоо:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Үргэлжлэх хугацаа:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Категори:</span>
                    <span>{course.category}</span>
                  </div>
                </div>

                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {showPaymentModal && course && <PaymentModal course={course} onClose={() => setShowPaymentModal(false)} />}
    </div>
  )
}
