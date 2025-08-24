import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import PublicMediaGrid from "@/components/public-media-grid"
import { Play, Clock, Star, Users, Trophy } from "lucide-react"
import type { Course } from "@/lib/types"
import { db } from "@/lib/database"

interface Stats {
  totalStudents: number
  averageRating: string
  completedLessons: number
}

interface PlatformFeatures {
  feature1: {
    title: string
    description: string
    icon: string
  }
  feature2: {
    title: string
    description: string
    icon: string
  }
  feature3: {
    title: string
    description: string
    icon: string
  }
}

export default async function Home() {
  // Server-side data fetching
  let courses: Course[] = []
  let stats: Stats = {
    totalStudents: 0,
    averageRating: "4.8",
    completedLessons: 0
  }
  let features: PlatformFeatures = {
    feature1: {
      title: "Хэзээ ч, хаанаас ч",
      description: "Таны хүссэн цагт, хүссэн газартаас суралцах боломжтой. Интернэт холболттой компьютер, таблет эсвэл утас хүчилтэй.",
      icon: "🌍"
    },
    feature2: {
      title: "Чанартай агуулга",
      description: "Мэргэжлийн багш нартай, чанартай видео хичээллүүд. Практик даалгавар, тестүүд болон сертификат.",
      icon: "🎯"
    },
    feature3: {
      title: "Хувийн хөгжил",
      description: "Таны хурдад тохируулсан сургалт. Прогресс хяналт, хувийн дэвтэр болон багшийн дэмжлэг.",
      icon: "📈"
    }
  }

  try {
    // Fetch courses
    const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses`, { cache: 'no-store' })
    if (coursesResponse.ok) {
      const coursesData = await coursesResponse.json()
      courses = coursesData.courses || []
    }

    // Fetch stats
    const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stats`, { cache: 'no-store' })
    if (statsResponse.ok) {
      const statsData = await statsResponse.json()
      stats = statsData.stats
    }

    // Fetch features
    const featuresResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/features`, { cache: 'no-store' })
    if (featuresResponse.ok) {
      const featuresData = await featuresResponse.json()
      if (featuresData.features) {
        features = featuresData.features
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    // Use fallback data if fetching fails
  }

  // Get featured course only when courses are loaded
  const featuredCourse = courses.length > 0 ? courses.find((course) => course.title === "AI Course") || courses[0] : null

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
          {featuredCourse ? (
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
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="bg-gray-200 rounded-2xl aspect-video mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Media Grid Section */}
      <PublicMediaGrid />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Яагаад Бид?</h2>
            <p className="text-gray-600 text-lg">Манай платформын онцлог шинж чанарууд</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features ? (
              <>
                <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl">{features.feature1?.icon || "📚"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{features.feature1?.title || "Онлайн сургалт"}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {features.feature1?.description || "Хугацаатай, хурдан, хүнсэн сургалт"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl">{features.feature2?.icon || "💬"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{features.feature2?.title || "Харилцах"}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {features.feature2?.description || "Харилцах, харилцах, харилцах"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl">{features.feature3?.icon || "👥"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{features.feature3?.title || "Хувь хүн"}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {features.feature3?.description || "Хувь хүн, хувь хүн, хувь хүн"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Fallback to hardcoded features while loading
              <>
                <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Play className="w-8 h-8 text-[#5B7FFF]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Чанартай видео & аудио</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээллүүдээр
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-green-600">₮</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Үнэ хятад & хямд үнэ</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-gray-100 shadow-lg rounded-2xl bg-white">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Мэргэжлийн багш нар</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
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
                    <div className="text-4xl font-bold text-gray-900 mb-1">{stats.totalStudents || "100+"}</div>
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
                    <div className="text-4xl font-bold text-gray-900 mb-1">{stats.averageRating || "4.8/5"}</div>
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
                    <div className="text-4xl font-bold text-gray-900 mb-1">{stats.completedLessons || "15,000+"}</div>
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
