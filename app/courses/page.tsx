import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Users, Play } from "lucide-react"
import type { Course } from "@/lib/types"
import { getDisplayTitle, getDisplayDescription, getDisplayCategory } from "@/lib/course-utils"

export default async function CoursesPage() {
  // Server-side data fetching
  let courses: Course[] = []

  try {
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://edunewera.mn')

    const response = await fetch(`${baseUrl}/api/courses`, { next: { revalidate: 60 } })
    if (response.ok) {
      const data = await response.json()
      courses = data.courses || []
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    courses = []
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Бүх хичээлүүд</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                <div className="aspect-video bg-muted relative">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                      <Play className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#5B7FFF] text-white">
                      {course.category || "Хичээл"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-card-foreground mb-2">
                    {getDisplayTitle(course.title)}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {getDisplayDescription(course.title, course.description)}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                      <Link href={`/courses/${course._id}`}>Дэлгэрэнгүй</Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Хичээл олдсонгүй</h3>
            <p className="text-muted-foreground mb-6">Одоогоор бүртгэгдсэн хичээл байхгүй байна.</p>
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
