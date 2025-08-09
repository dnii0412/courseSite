import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Play, Users, Award, TrendingUp, CreditCard, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const reportData = {
  totalRevenue: 15420000,
  totalStudents: 1234,
  totalCourses: 56,
  completionRate: 89,
  monthlyGrowth: 12,
  popularCourses: [
    { name: 'React.js сургалт', enrollments: 234, revenue: 35100000 },
    { name: 'Node.js сургалт', enrollments: 189, revenue: 28350000 },
    { name: 'Python сургалт', enrollments: 156, revenue: 23400000 },
    { name: 'JavaScript сургалт', enrollments: 145, revenue: 21750000 },
    { name: 'TypeScript сургалт', enrollments: 123, revenue: 18450000 }
  ]
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F3EF]">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1B3C53] leading-tight">
                New Era Academy
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-lg text-[#456882] italic">
                "Empowering minds through innovative learning experiences"
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6 gradient-button text-white border-0 shadow-lg">
                <Link href="/auth/register">Бүртгүүлэх</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 gradient-outline-button shadow-lg">
                <Link href="/courses">Хичээлүүд үзэх</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Logo/Profile Picture with Floating Effect */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#456882]/20 to-[#1B3C53]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D2C1B6]/20 to-[#F9F3EF]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Main image container with floating animation */}
              <div className="relative z-10 animate-float">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#456882] to-[#1B3C53] p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-[#F9F3EF] flex items-center justify-center overflow-hidden">
                    <img
                      src="/new_Era_logo.jpeg"
                      alt="Course Site Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Floating particles */}
              <div className="absolute top-10 left-10 w-4 h-4 bg-[#456882] rounded-full animate-bounce opacity-60"></div>
              <div className="absolute top-20 right-16 w-3 h-3 bg-[#1B3C53] rounded-full animate-bounce opacity-60 delay-300"></div>
              <div className="absolute bottom-16 left-20 w-2 h-2 bg-[#D2C1B6] rounded-full animate-bounce opacity-60 delay-500"></div>
              <div className="absolute bottom-8 right-8 w-3 h-3 bg-[#F9F3EF] rounded-full animate-bounce opacity-60 delay-700 border border-[#D2C1B6]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B3C53] mb-4">
            Манай сургалтын төвийн статистик
          </h2>
          <p className="text-gray-700">
            Олон мянган сурагч манай платформ дээр суралцаж байна
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card className="bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53]">
                Нийт орлого
              </CardTitle>
              <CreditCard className="h-4 w-4 text-[#456882]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53]">
                ₮{reportData.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-[#456882]">
                +{reportData.monthlyGrowth}% өнгөрсөн сартай харьцуулахад
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53]">
                Нийт сурагч
              </CardTitle>
              <Users className="h-4 w-4 text-[#456882]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53]">
                {reportData.totalStudents.toLocaleString()}
              </div>
              <p className="text-xs text-[#456882]">
                +{reportData.monthlyGrowth}% өнгөрсөн сартай харьцуулахад
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53]">
                Нийт сургалт
              </CardTitle>
              <BookOpen className="h-4 w-4 text-[#456882]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53]">
                {reportData.totalCourses}
              </div>
              <p className="text-xs text-[#456882]">
                Идэвхтэй сургалтууд
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53]">
                Дуусгах түвшин
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#456882]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53]">
                {reportData.completionRate}%
              </div>
              <p className="text-xs text-[#456882]">
                Дундаж дуусгах түвшин
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B3C53] mb-4">
            Хамгийн түгээмэл сургалтууд
          </h2>
          <p className="text-gray-700">
            Олон сурагчдын сонгосон хичээлүүд
          </p>
        </div>

        <Card className="bg-[#F9F3EF] border-[#D2C1B6]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#1B3C53]">Топ хичээлүүд</CardTitle>
              <div className="flex items-center space-x-2">
                <Select defaultValue="30">
                  <SelectTrigger className="w-32 bg-[#F9F3EF] border-[#D2C1B6]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 хоног</SelectItem>
                    <SelectItem value="30">30 хоног</SelectItem>
                    <SelectItem value="90">90 хоног</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-[#D2C1B6] text-[#1B3C53] hover:bg-[#456882] hover:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  График
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.popularCourses.map((course, index) => (
                <div key={course.name} className="flex items-center justify-between p-4 border border-[#EAD8B1] rounded-lg bg-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-[#001F3F] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#001F3F]">{course.name}</p>
                      <p className="text-sm text-[#3A6D8C]">
                        {course.enrollments} элсэлт
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#001F3F]">
                      ₮{course.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-[#3A6D8C]">
                      Орлого
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B3C53] mb-4">
            Яагаад манай платформыг сонгох вэ?
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <Card className="text-center bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader>
              <BookOpen className="w-12 h-12 mx-auto text-[#456882]" />
              <CardTitle className="text-[#1B3C53]">Олон төрлийн хичээл</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[#456882]">
                Технологи, бизнес, урлаг гэх мэт олон салбарын хичээлүүд
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader>
              <Play className="w-12 h-12 mx-auto text-[#456882]" />
              <CardTitle className="text-[#1B3C53]">Видео хичээл</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[#456882]">
                Өндөр чанартай видео хичээлүүдийг хүссэн цагтаа үзээрэй
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-[#456882]" />
              <CardTitle className="text-[#1B3C53]">Мэргэжлийн багш нар</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[#456882]">
                Туршлагатай, мэргэжлийн багш нараас суралцаарай
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-[#F9F3EF] border-[#D2C1B6]">
            <CardHeader>
              <Award className="w-12 h-12 mx-auto text-[#456882]" />
              <CardTitle className="text-[#1B3C53]">Гэрчилгээ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[#456882]">
                Хичээлээ дуусгасны дараа гэрчилгээ авах боломжтой
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
