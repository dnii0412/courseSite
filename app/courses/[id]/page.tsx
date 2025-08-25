"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Star, Users, Play, CheckCircle, ShoppingCart, UserPlus } from "lucide-react"
import type { Course } from "@/lib/types"
import { useAuth } from "@/lib/hooks/useAuth"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CoursePage({ params }: PageProps) {
  const { id } = use(params)
  const { user, loading: authLoading, refreshUser } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`, { cache: 'no-store' })
        if (response.ok) {
          const courseData = await response.json()
          setCourse(courseData.course)
        } else {
          setError(true)
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourse()
    }
  }, [id])

  // Refresh user data when component mounts (in case admin granted access)
  useEffect(() => {
    // Always refresh user data when component mounts to get latest enrollments
    if (!authLoading) {
      refreshUser()
    }
  }, [authLoading])

  // Also refresh when user data changes
  useEffect(() => {
    if (user && !user.enrolledCourses) {
      // If user exists but has no enrolled courses data, refresh
      refreshUser()
    }
  }, [user?.id])

  // Check enrollment status
  const isLoggedIn = !!user
  const isEnrolled = course && user?.enrolledCourses?.includes(course._id || '')



  // Determine what button to show
  const getEnrollmentButton = () => {
    if (!isLoggedIn) {
      return (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800 dark:text-orange-200">Бүртгүүлэх шаардлагатай</span>
          </div>
          <p className="text-orange-700 dark:text-orange-300 text-sm mb-4">
            Энэ хичээлийг худалдаж авахын тулд эхлээд бүртгүүлнэ үү
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
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
          </div>
        </div>
      )
    }

    if (!isEnrolled) {
      return (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800 dark:text-red-200">Худалдаж авах шаардлагатай</span>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm mb-4">
            Энэ хичээлийг үзэхийн тулд худалдаж авна уу
          </p>
          <div className="space-y-2">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {course?.price ? `${course.price}₮ -өөр худалдаж авах` : 'Худалдаж авах'}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/courses">
                Бүх хичээлүүд үзэх
              </Link>
            </Button>
          </div>
        </div>
      )
    }

    // User is enrolled
    return (
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800 dark:text-blue-200">Бүртгэлтэй</span>
        </div>
        <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
          Та энэ хичээлийг үзэх боломжтой
        </p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Link href={`/courses/${course._id}/learn`}>
            <Play className="w-4 h-4 mr-2" />
            Үргэлжлүүлэх
          </Link>
        </Button>
      </div>
    )
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Уншиж байна...</h1>
          <p className="text-muted-foreground mb-8">Хичээлийн мэдээллийг татаж байна.</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Хичээл олдсонгүй</h1>
          <p className="text-muted-foreground mb-8">Хүссэн хичээл байхгүй эсвэл алдаа гарлаа.</p>
          <Button asChild className="bg-[#5B7FFF] hover:bg-[#4A6FE7]">
            <Link href="/courses">Бүх хичээлүүд рүү буцах</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Course Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Course Info - Left Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {course.title}
              </h1>

              {/* Course Metadata */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating || "0"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledCount || 0} оролц</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>{course.lessons?.length || 0} хичээл</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.subCourses?.length || 0} хэсэг</span>
                </div>
              </div>

              {/* Course Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {course.category || "Хичээл"}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  {course.level || "intermediate"}
                </Badge>
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Бүртгэлтэй
                </Badge>
              </div>

              {/* Course Description */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Хичээлийн тайлбар</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {course.description || "Хичээлийн тайлбар байхгүй байна"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Хичээлийн тоо:</span>
                    <span className="font-medium">{course.lessons?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Үргэлжлэх хугацаа:</span>
                    <span className="font-medium">{course.duration || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Категори:</span>
                    <span className="font-medium">{course.category || "Хичээл"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Video Player & Enrollment - Right Column */}
          <div className="space-y-6">
            {/* Video Player */}
            <div className="relative">
              {course.videoUrl ? (
                <video
                  src={course.videoUrl}
                  className="w-full aspect-video bg-gray-900 rounded-lg"
                  controls
                />
              ) : (
                <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <Play className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>



            {/* Enrollment Status */}
            {getEnrollmentButton()}

            {/* Course Statistics */}

          </div>
        </div>
      </section>

      {/* Course Content */}


      <Footer />
    </div>
  )
}
