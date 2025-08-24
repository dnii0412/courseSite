"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Play, Clock, Star, Users, Search, Filter, BookOpen, Lock } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Course } from "@/lib/types"

interface EnrolledCourse {
  courseId: string
  enrolledAt: string
  isActive: boolean
}

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await fetch("/api/courses")
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.courses || [])
        setFilteredCourses(coursesData.courses || [])

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
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchData()
    }
  }, [user, authLoading])

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCourses(filtered)
  }, [searchTerm, courses])

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(enrollment => 
      enrollment.courseId === courseId && enrollment.isActive
    )
  }

  const getCourseButton = (course: Course) => {
    if (!user) {
      return (
        <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
          <Link href="/login">Нэвтрэх</Link>
        </Button>
      )
    }

    if (isEnrolled(course._id || '')) {
      return (
        <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
          <Link href={`/courses/${course._id}`}>
            <BookOpen className="w-4 h-4 mr-2" />
            Үргэлжлүүлэх
          </Link>
        </Button>
      )
    }

    return (
      <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
        <Link href={`/courses/${course._id}`}>Дэлгэрэнгүй</Link>
      </Button>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading courses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Бүх хичээллүүд</h1>
          


          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Хичээл хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Шинэ</option>
                <option>Алдартай</option>
                <option>Үнэ багаас их</option>
                <option>Үнэ ихээс бага</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id?.toString()} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={course.thumbnailUrl || "/placeholder.svg?height=200&width=300"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-primary">▶</span>
                  </div>
                </div>
                {isEnrolled(course._id || '') && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Бүртгэлтэй
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration} хичээл</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolledCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">₮{course.price.toLocaleString()}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₮{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>

                  <div className="pt-2">
                    {getCourseButton(course)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
