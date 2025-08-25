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
  let gridLayout: any = null

  try {
    // Fetch courses
    const coursesResponse = await fetch('/api/courses', { next: { revalidate: 60 } })
    if (coursesResponse.ok) {
      const coursesData = await coursesResponse.json()
      courses = coursesData.courses || []
    }

    // Fetch stats
    const statsResponse = await fetch('/api/stats', { next: { revalidate: 300 } })
    if (statsResponse.ok) {
      const statsData = await statsResponse.json()
      stats = statsData.stats
    }

    // Fetch features
    const featuresResponse = await fetch('/api/features', { next: { revalidate: 3600 } })
    if (featuresResponse.ok) {
      const featuresData = await featuresResponse.json()
      if (featuresData.features) {
        features = featuresData.features
      }
    }

    // Fetch media grid layout
    const gridResponse = await fetch('/api/media-grid', { next: { revalidate: 300 } })
    if (gridResponse.ok) {
      const gridData = await gridResponse.json()
      if (gridData.layout && gridData.layout.isPublished) {
        gridLayout = gridData.layout
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    // Use fallback data if fetching fails
  }

  // Get featured course - use first available course or null
  const featuredCourse = courses.length > 0 ? courses[0] : null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <Badge className="bg-[#5B7FFF] text-white px-6 py-2 rounded-full text-sm font-medium">
              {featuredCourse ? `🚀 ${featuredCourse.category || 'Хичээл'}` : '🚀 Хичээл'}
            </Badge>

            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">Чанартай хичээллүүд.</h1>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#5B7FFF] leading-tight">Хэзээ ч, хаанаас ч.</h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
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
                className="border-gray-300 text-white px-8 py-3 rounded-lg bg-transparent"
              >
                Хичээллүүдийг үзэх
              </Button>
            </div>
          </div>

          {/* Featured Course Card */}
          {featuredCourse ? (
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground mb-2 sm:mb-3">{featuredCourse.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{featuredCourse.description || "Хичээлийн тайлбар"}</p>
                </div>

                <div className="relative bg-muted rounded-lg sm:rounded-xl aspect-video mb-4 sm:mb-6 flex items-center justify-center border border-border">
                  {featuredCourse.thumbnailUrl ? (
                    <img 
                      src={featuredCourse.thumbnailUrl} 
                      alt={featuredCourse.title}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#5B7FFF] rounded-full flex items-center justify-center">
                      <Play className="w-6 w-6 sm:w-8 sm:h-8 text-white ml-1" />
                    </div>
                  )}
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500">₮{featuredCourse.price?.toLocaleString() || "0"}</span>
                    {featuredCourse.originalPrice && featuredCourse.originalPrice > featuredCourse.price && (
                      <>
                        <span className="text-sm sm:text-lg text-muted-foreground line-through">₮{featuredCourse.originalPrice.toLocaleString()}</span>
                        <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm px-2 sm:px-3 py-1">
                          SAVE ₮{(featuredCourse.originalPrice - featuredCourse.price).toLocaleString()}
                        </Badge>
                      </>
                    )}
                  </div>
                  {!featuredCourse.originalPrice && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1">Хамгийн сайн үнэ</Badge>
                  )}
                </div>

                <Button asChild className="w-full bg-[#5B7FFF] hover:bg-[#4A6FE7] text-white py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base">
                  <Link href={`/courses/${featuredCourse._id}`}>Хичээлд бүртгүүлэх</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
              <div className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-5 sm:h-6 bg-muted rounded mb-3"></div>
                  <div className="h-3 bg-muted rounded mb-3 sm:mb-4"></div>
                  <div className="bg-muted rounded-lg sm:rounded-xl aspect-video mb-3 sm:mb-4"></div>
                  <div className="h-4 sm:h-5 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-3 sm:mb-4"></div>
                  <div className="h-8 sm:h-10 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Media Grid Section */}
      <PublicMediaGrid gridLayout={gridLayout} />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Яагаад Бид?</h2>
            <p className="text-muted-foreground text-lg">Манай платформын онцлог шинж чанарууд</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features ? (
              <>
                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl">{features.feature1?.icon || "📚"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">{features.feature1?.title || "Онлайн сургалт"}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {features.feature1?.description || "Хугацаатай, хурдан, хүнсэн сургалт"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl">{features.feature2?.icon || "💬"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">{features.feature2?.title || "Харилцах"}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {features.feature2?.description || "Харилцах, харилцах, харилцах"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl">{features.feature3?.icon || "👥"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">{features.feature3?.title || "Хувь хүн"}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {features.feature3?.description || "Хувь хүн, хувь хүн, хувь хүн"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Fallback to hardcoded features while loading
              <>
                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Play className="w-8 h-8 text-[#5B7FFF]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">Чанартай видео & аудио</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээллүүдээр
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-green-600">₮</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">Үнэ хятад & хямд үнэ</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">Мэргэжлийн багш нар</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
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
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
                      <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">New Era статистик</h2>
            <p className="text-muted-foreground text-lg">Манай платформ дээр суралцаж буй суралцагчдын амжилт</p>
          </div>

                          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-[#5B7FFF]" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-card-foreground mb-1">{stats.totalStudents || "100+"}</div>
                      <div className="text-card-foreground font-semibold mb-1">Нийт сурагч</div>
                      <div className="text-sm text-muted-foreground">Идэвхтэй суралцаж буй суралцагчид</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-card-foreground mb-1">{stats.averageRating || "4.8/5"}</div>
                      <div className="text-card-foreground font-semibold mb-1">Дундаж үнэлгээ</div>
                      <div className="text-sm text-muted-foreground">Суралцагчдын сэтгэгдэл</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border border-border shadow-lg rounded-2xl bg-card">
                  <CardContent className="space-y-4 p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-card-foreground mb-1">{stats.completedLessons || "15,000+"}</div>
                      <div className="text-card-foreground font-semibold mb-1">Хичээл дуусгасан</div>
                      <div className="text-sm text-muted-foreground">Амжилттай төгссөн хичээллүүд</div>
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
