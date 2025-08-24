"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Play, Clock, Star, Users, Trophy } from "lucide-react"
import type { Course } from "@/lib/types"

interface Stats {
  userCount: number
  courseCount: number
  enrollmentCount: number
  totalRevenue: number
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([fetch("/api/courses"), fetch("/api/stats")])

        const coursesData = await coursesRes.json()
        const statsData = await statsRes.json()

        setCourses(coursesData.courses || [])
        setStats(statsData.stats)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const featuredCourse = courses.find((course) => course.title === "AI Course") || courses[0]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="bg-[#5B7FFF] text-white px-6 py-2 rounded-full text-sm font-medium">🚀 AI сургалт</Badge>

            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">Чанартай хичээллүүд.</h1>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#5B7FFF] leading-tight">Хэзээ ч, хаанаас ч.</h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Мэргэжлийн багш нартай, чанартай видео хичээллүүдээр таны ур чадварыг хөгжүүлнэ. Хүссэн, байршаас үл
              хамааран суралцаарай.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#5B7FFF] hover:bg-[#4A6FE7] text-white px-8 py-3 rounded-lg">
                <Link href="/courses">Бүртгүүлэх</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 px-8 py-3 rounded-lg bg-transparent"
              >
                Хичээллүүдийг үзэх
              </Button>
            </div>
          </div>

          {/* Featured Course Card */}
          {featuredCourse && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Course</h3>
                  <p className="text-gray-600">Machine Learning & Deep Learning</p>
                </div>

                <div className="relative bg-gray-50 rounded-2xl aspect-video mb-6 flex items-center justify-center border border-gray-100">
                  <div className="w-16 h-16 bg-[#5B7FFF] rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-orange-500">₮69,000</span>
                    <span className="text-lg text-gray-400 line-through">₮210,000</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">SAVE ₮141,000</Badge>
                </div>

                <Button className="w-full bg-[#5B7FFF] hover:bg-[#4A6FE7] text-white py-3 rounded-lg font-medium">
                  Хичээлд бүртгүүлэх
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Манай платформын давуу талууд</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Манай платформын давуу талууд</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Play className="w-10 h-10 text-[#5B7FFF]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Чанартай видео & аудио</h3>
              <p className="text-gray-600 leading-relaxed">
                HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээллүүдээр
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">₮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Үнэ хятад & хямд үнэ</h3>
              <p className="text-gray-600 leading-relaxed">
                Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Мэргэжлийн багш нар</h3>
              <p className="text-gray-600 leading-relaxed">
                Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {stats && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">New Era статистик</h2>
              <p className="text-gray-600 text-lg">Манай платформ дээр суралцаж буй суралцагчдын амжилт</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                <CardContent className="space-y-4 p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-[#5B7FFF]" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">100+</div>
                    <div className="text-gray-900 font-semibold mb-1">Нийт сурагч</div>
                    <div className="text-sm text-gray-500">Идэвхтэй суралцаж буй суралцагчид</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                <CardContent className="space-y-4 p-0">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">4.8/5</div>
                    <div className="text-gray-900 font-semibold mb-1">Дундаж үнэлгээ</div>
                    <div className="text-sm text-gray-500">Суралцагчдын сэтгэгдэл</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                <CardContent className="space-y-4 p-0">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">15,000+</div>
                    <div className="text-gray-900 font-semibold mb-1">Хичээл дуусгасан</div>
                    <div className="text-sm text-gray-500">Амжилттай төгссөн хичээллүүд</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
