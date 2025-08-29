import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Users, Play } from "lucide-react"
import type { Course } from "@/lib/types"
import { CourseEnrollmentClient } from "./course-enrollment-client"
import { notFound } from "next/navigation"
import { getDisplayTitle, getDisplayDescription, getDisplayCategory } from "@/lib/course-utils"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCourse(id: string): Promise<Course | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://edunewera.mn')

    const response = await fetch(`${baseUrl}/api/courses/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const courseData = await response.json()
      return courseData.course
    }
    return null
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Course Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="mb-4">
              <Badge className="bg-[#5B7FFF] text-white mb-4">
                {getDisplayCategory(course.title)}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {getDisplayTitle(course.title)}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              {getDisplayDescription(course.title, course.description)}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{course.rating || "4.8"} үнэлгээ</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.enrolledCount || 0} суралцагч</span>
              </div>
              <div className="text-2xl font-bold text-[#5B7FFF]">
                ₮{course.price?.toLocaleString() || "0"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Course Description - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Хичээлийн тухай</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Хичээлийн агуулга</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {course.lessons && course.lessons.length > 0 ? (
                        course.lessons.map((lesson, index) => (
                          <div key={lesson._id || index} className="flex items-center gap-3 p-3 rounded-lg border">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            </div>
                            {lesson.isPreview && (
                              <Badge variant="secondary">Үнэгүй</Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Хичээлийн агуулга удахгүй нэмэгдэх болно.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Video Player & Enrollment - Right Column */}
            <div className="space-y-6">
              {/* Course Thumbnail/Video Player */}
              <div className="relative">
                {course.videoUrl ? (
                  <video
                    src={course.videoUrl}
                    className="w-full aspect-video bg-gray-900 rounded-lg"
                    controls
                  />
                ) : course.thumbnailUrl ? (
                  <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-24 h-24 text-white/80" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <Play className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Enrollment Status */}
              <Card>
                <CardContent className="p-6">
                  <CourseEnrollmentClient course={course} />
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Хичээлийн мэдээлэл</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Үнэлгээ</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{course.rating || "4.8"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Суралцагчид</span>
                    <span className="font-medium">{course.enrolledCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Төвшин</span>
                    <Badge variant="secondary">
                      {course.level === "beginner" ? "Анхан шат" :
                        course.level === "intermediate" ? "Дундаж" : "Ахисан"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Үнэ</span>
                    <span className="font-bold text-primary">₮{course.price?.toLocaleString() || "0"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}