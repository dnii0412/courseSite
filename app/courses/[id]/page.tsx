import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Star, Users, Play, BookOpen, CheckCircle } from "lucide-react"
import type { Course } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params
  
  // Server-side data fetching
  let course: Course | null = null
  let error = false

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses/${id}`, { cache: 'no-store' })
    if (response.ok) {
      course = await response.json()
    } else {
      error = true
    }
  } catch (error) {
    console.error("Error fetching course:", error)
    error = true
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Хичээл олдсонгүй</h1>
          <p className="text-gray-600 mb-8">Хүссэн хичээл байхгүй эсвэл алдаа гарлаа.</p>
          <Button asChild className="bg-[#5B7FFF] hover:bg-[#4A6FE7]">
            <Link href="/courses">Бүх хичээлүүд рүү буцах</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Course Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Course Info */}
          <div className="space-y-6">
            <Badge className="bg-[#5B7FFF] text-white px-4 py-2 rounded-full text-sm font-medium">
              {course.category || "Хичээл"}
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.duration || "2 цаг"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{course.rating || "4.8"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.enrolledCount || 0} сурагч</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-[#5B7FFF]">
                ₮{course.price?.toLocaleString() || "0"}
              </div>
              {course.originalPrice && course.originalPrice > course.price && (
                <div className="text-xl text-gray-400 line-through">
                  ₮{course.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="bg-[#5B7FFF] hover:bg-[#4A6FE7] text-white px-8 py-3 rounded-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Бүртгүүлэх
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-lg">
                <Play className="w-5 h-5 mr-2" />
                Үнэгүй үзэх
              </Button>
            </div>
          </div>

          {/* Course Thumbnail */}
          <div className="relative">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl flex items-center justify-center">
                <Play className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Хичээлийн агуулга</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Та юу сурах вэ?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Хичээлийн үндсэн ойлголтууд</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Практик даалгавар</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Тестүүд</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Сертификат</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Хичээлийн мэдээлэл</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хичээлийн түвшин</span>
                    <span className="font-medium">{course.level || "Дунд"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хугацаа</span>
                    <span className="font-medium">{course.duration || "2 цаг"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Сертификат</span>
                    <span className="font-medium text-green-600">Тийм</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Багшийн мэдээлэл</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#5B7FFF] rounded-full flex items-center justify-center text-white font-bold">
                      Б
                    </div>
                    <div>
                      <div className="font-medium">Мэргэжлийн багш</div>
                      <div className="text-sm text-gray-600">Тус салбарын мэргэжилтэн</div>
                    </div>
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
