import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Star, Users, Play } from "lucide-react"
import type { Course } from "@/lib/types"

export default async function CoursesPage() {
  // Server-side data fetching
  let courses: Course[] = []

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses`, { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      courses = data.courses || []
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    courses = []
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">Бүх хичээлүүд</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Мэргэжлийн багш нартай, чанартай видео хичээллүүдээр таны ур чадварыг хөгжүүлнэ
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 pb-20">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video bg-gray-200 relative">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Play className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#5B7FFF] text-white">
                      {course.category || "Хичээл"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration || "2 цаг"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{course.rating || "4.8"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolledCount || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-[#5B7FFF]">
                      ₮{course.price?.toLocaleString() || "0"}
                    </div>
                    <Button asChild className="bg-[#5B7FFF] hover:bg-[#4A6FE7]">
                      <Link href={`/courses/${course._id}`}>Харах</Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Хичээл олдсонгүй</h3>
            <p className="text-gray-600 mb-6">Одоогоор бүртгэгдсэн хичээл байхгүй байна.</p>
            <Button asChild className="bg-[#5B7FFF] hover:bg-[#4A6FE7]">
              <Link href="/">Нүүр хуудас руу буцах</Link>
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
