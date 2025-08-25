"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Play, Clock, BookOpen, ChevronLeft, Check, Lock, Video, UserPlus, ShoppingCart } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Course, Lesson } from "@/lib/types"
import Link from "next/link"

interface EnrolledCourse {
  courseId: string
  enrolledAt: string
  isActive: boolean
}

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading, refreshUser } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [subCourses, setSubCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course
        const courseResponse = await fetch(`/api/courses/${params.id}`)
        if (!courseResponse.ok) {
          throw new Error("Course not found")
        }
        const courseData = await courseResponse.json()
        setCourse(courseData.course)

        // Check if user is enrolled in this course
        if (user) {
          // User is already authenticated, check their enrolledCourses array
          const courseId = params.id as string
          const isEnrolledInThisCourse = user.enrolledCourses?.includes(courseId)
          if (isEnrolledInThisCourse) {
            setEnrolledCourses([{
              courseId: courseId,
              enrolledAt: new Date().toISOString(),
              isActive: true
            }])
          }
        }

        // Fetch sub-courses for this course
        try {
          const subCoursesResponse = await fetch(`/api/sub-courses?courseId=${params.id}`)
          if (subCoursesResponse.ok) {
            const subCoursesData = await subCoursesResponse.json()
            setSubCourses(subCoursesData.subCourses || [])
          }
        } catch (error) {

        }

        // Set first lesson as selected by default
        if (courseData.course?.lessons?.length > 0) {
          setSelectedLesson(courseData.course.lessons[0])
        }
      } catch (error) {

        router.push("/courses")
      } finally {
        setLoading(false)
      }
    }

    if (params.id && !authLoading) {
      fetchData()
    }
  }, [params.id, user, authLoading, router])

  // Refresh user data when component mounts (in case admin granted access)
  useEffect(() => {
    if (user && !authLoading) {
      refreshUser()
    }
  }, [user?.id, authLoading])

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

    // Regular users need to be enrolled - check user's enrolledCourses array
    return user?.enrolledCourses?.includes(courseId) || false
  }

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
  }



  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.isPreview) {
      return 'preview'
    }
    return 'locked'
  }

  const getLessonIcon = (lesson: Lesson) => {
    const status = getLessonStatus(lesson)
    switch (status) {
      case 'preview':
        return <Play className="w-4 h-4 text-blue-600" />
      default:
        return <Play className="w-4 h-4 text-blue-600" />
    }
  }

  const getLessonBadge = (lesson: Lesson) => {
    const status = getLessonStatus(lesson)
    switch (status) {
      case 'preview':
        return <Badge variant="secondary">Үнэгүй</Badge>
      default:
        return null
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-foreground">Loading course...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-foreground">Course not found</div>
        </div>
      </div>
    )
  }



  const userHasAccess = hasAccess(course._id || '')

  if (!userHasAccess) {
    const isLoggedIn = !!user

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            {!isLoggedIn ? (
              <>
                <div className="text-6xl mb-6">🔐</div>
                <h1 className="text-3xl font-bold mb-4 text-foreground">Бүртгүүлэх шаардлагатай</h1>
                <p className="text-muted-foreground mb-6">
                  Энэ хичээлийг худалдаж авахын тулд эхлээд бүртгүүлнэ үү
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                    <Link href="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Бүртгүүлэх
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">
                      Нэвтрэх
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href={`/courses/${course._id}`}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Хичээл рүү буцах
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-6">💳</div>
                <h1 className="text-3xl font-bold mb-4 text-foreground">Худалдаж авах шаардлагатай</h1>
                <p className="text-muted-foreground mb-6">
                  Энэ хичээлийг үзэхийн тулд худалдаж авна уу
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {course?.price ? `${course.price}₮ -өөр худалдаж авах` : 'Худалдаж авах'}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/courses/${course._id}`}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Хичээл рүү буцах
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/courses/${course._id}`}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Хичээл рүү буцах
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.description}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sub-courses and Lessons Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Хичээлүүд
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subCourses.map((subCourse) => (
                    <div key={subCourse._id} className="space-y-2">
                      {/* Sub-course header */}
                      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm text-foreground truncate">
                            {subCourse.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                          {course.lessons?.filter(lesson => lesson.subCourseId === subCourse._id).length || 0} хичээл
                        </span>
                      </div>

                      {/* Lessons under this sub-course */}
                      <div className="space-y-2 ml-4">
                        {course.lessons
                          ?.filter(lesson => lesson.subCourseId === subCourse._id)
                          .sort((a, b) => a.order - b.order)
                          .map((lesson) => (
                            <div
                              key={lesson._id}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedLesson?._id === lesson._id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                                }`}
                              onClick={() => handleLessonSelect(lesson)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {getLessonIcon(lesson)}
                                  <span className="font-medium text-sm text-foreground truncate">
                                    {lesson.order}. {lesson.title}
                                  </span>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                  {getLessonBadge(lesson)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration} мин</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  {/* Show lessons without sub-course if any */}
                  {course.lessons
                    ?.filter(lesson => !lesson.subCourseId || !subCourses.find(sc => sc._id === lesson.subCourseId))
                    .map((lesson, index) => (
                      <div
                        key={lesson._id || index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedLesson?._id === lesson._id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                          }`}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {getLessonIcon(lesson)}
                            <span className="font-medium text-sm text-foreground truncate">
                              {lesson.order}. {lesson.title}
                            </span>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            {getLessonBadge(lesson)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration} мин</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  {selectedLesson?.title || "Хичээл сонгоно уу"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLesson ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      {selectedLesson.videoUrl ? (
                        <iframe
                          src={selectedLesson.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <div className="text-center">
                            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Видео олдсонгүй</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{selectedLesson.title}</h3>
                      <p className="text-muted-foreground mb-4">{selectedLesson.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{selectedLesson.duration} мин</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Хичээл {selectedLesson.order}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Хичээл сонгоно уу</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
