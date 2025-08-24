"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Play, Clock, BookOpen, ChevronLeft, Check, Lock, Video } from "lucide-react"
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
  const { user, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [subCourses, setSubCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

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

        // Fetch user enrollments if logged in
        if (user) {
          try {
            const enrollmentsResponse = await fetch("/api/auth/enrollments")
            if (enrollmentsResponse.ok) {
              const enrollmentsData = await enrollmentsResponse.json()
              setEnrolledCourses(enrollmentsData.enrollments || [])
            }
          } catch (error) {
            console.error("Error fetching enrollments:", error)
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
          console.error("Error fetching sub-courses:", error)
        }

        // Set first lesson as selected by default
        if (courseData.course?.lessons?.length > 0) {
          setSelectedLesson(courseData.course.lessons[0])
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        router.push("/courses")
      } finally {
        setLoading(false)
      }
    }

    if (params.id && !authLoading) {
      fetchData()
    }
  }, [params.id, user, authLoading, router])

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

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
  }

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))
    // TODO: Save progress to backend
  }

  const getLessonStatus = (lesson: Lesson) => {
    if (completedLessons.has(lesson._id || '')) {
      return 'completed'
    }
    if (lesson.isPreview) {
      return 'preview'
    }
    return 'locked'
  }

  const getLessonIcon = (lesson: Lesson) => {
    const status = getLessonStatus(lesson)
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />
      case 'preview':
        return <Play className="w-4 h-4 text-blue-600" />
      default:
        return <Lock className="w-4 h-4 text-gray-400" />
    }
  }

  const getLessonBadge = (lesson: Lesson) => {
    const status = getLessonStatus(lesson)
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">Дууссан</Badge>
      case 'preview':
        return <Badge variant="secondary">Үнэгүй</Badge>
      default:
        return <Badge variant="outline">Хаалттай</Badge>
    }
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

  if (!userHasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Хандалт хязгаарлагдсан</h1>
            <p className="text-gray-600 mb-6">Энэ хичээлийг үзэхийн тулд та бүртгүүлэх хэрэгтэй.</p>
            <Button asChild>
              <Link href={`/courses/${course._id}`}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Буцах
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
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
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm text-gray-700">
                            {subCourse.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
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
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedLesson?._id === lesson._id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleLessonSelect(lesson)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getLessonIcon(lesson)}
                                  <span className="font-medium text-sm">
                                    {lesson.order}. {lesson.title}
                                  </span>
                                </div>
                                {getLessonBadge(lesson)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
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
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedLesson?._id === lesson._id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getLessonIcon(lesson)}
                            <span className="font-medium text-sm">
                              {lesson.order}. {lesson.title}
                            </span>
                          </div>
                          {getLessonBadge(lesson)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
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
                      <h3 className="text-xl font-semibold mb-2">{selectedLesson.title}</h3>
                      <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
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
                    {getLessonStatus(selectedLesson) !== 'completed' && (
                      <Button 
                        onClick={() => markLessonComplete(selectedLesson._id || '')}
                        className="w-full"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Дууссан гэж тэмдэглэх
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
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
