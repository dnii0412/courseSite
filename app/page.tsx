import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Users, TrendingUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
// Enrollment model removed

async function getStats() {
  try {
    await connectDB()

    const totalStudents = await User.countDocuments()
    const totalCourses = await Course.countDocuments()

    // Derive total enrollments from users' enrolledCourses
    const totalEnrollmentsAgg = await User.aggregate([
      { $project: { count: { $size: { $ifNull: ['$enrolledCourses', []] } } } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ])
    const totalEnrollments = totalEnrollmentsAgg?.[0]?.total || 0
    const completedEnrollments = 0
    const completionRate = 0

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      completionRate
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      completedEnrollments: 0,
      completionRate: 0
    }
  }
}

async function getPopularCourses() {
  try {
    await connectDB()

    // Get top 5 courses by number of users enrolled
    const courses = await Course.find().limit(20).select('_id title')
    const popularCoursesAgg = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $group: { _id: '$enrolledCourses', enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
    ])
    const map = new Map<string, number>(popularCoursesAgg.map((x: any) => [String(x._id), x.enrollments]))
    const popularCourses = courses
      .map((c: any) => ({ name: c.title, enrollments: map.get(String(c._id)) || 0 }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5)
    return popularCourses
  } catch (error) {
    console.error('Error fetching popular courses:', error)
    return []
  }
}

export default async function HomePage() {
  const stats = await getStats()
  const popularCourses = await getPopularCourses()

  return (
    <div className="min-h-screen bg-[#F9F3EF]">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-6 items-center min-h-[600px]">
          {/* Left Side - Text Content */}
          <div className="space-y-8 lg:ml-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1B3C53] leading-tight">
                New Era
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
            New Era статистик
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="bg-[#F9F3EF] border-[#D2C1B6] hover:bg-[#1B3C53] hover:text-white transition-colors duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53] group-hover:text-white">
                Нийт сурагч
              </CardTitle>
              <Users className="h-4 w-4 text-[#456882] group-hover:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53] group-hover:text-white">
                {stats.totalStudents.toLocaleString()}
              </div>
              <p className="text-xs text-[#456882] group-hover:text-white">
                Бүртгэлтэй сурагчид
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#F9F3EF] border-[#D2C1B6] hover:bg-[#1B3C53] hover:text-white transition-colors duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53] group-hover:text-white">
                Нийт сургалт
              </CardTitle>
              <BookOpen className="h-4 w-4 text-[#456882] group-hover:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53] group-hover:text-white">
                {stats.totalCourses}
              </div>
              <p className="text-xs text-[#456882] group-hover:text-white">
                Идэвхтэй сургалтууд
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#F9F3EF] border-[#D2C1B6] hover:bg-[#1B3C53] hover:text-white transition-colors duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#1B3C53] group-hover:text-white">
                Дуусгах түвшин
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#456882] group-hover:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1B3C53] group-hover:text-white">
                {stats.completionRate}%
              </div>
              <p className="text-xs text-[#456882] group-hover:text-white">
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

              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCourses.map((course: any, index: number) => (
                <div key={course.name} className="flex items-center justify-between p-4 border border-[#D2C1B6] rounded-lg bg-white hover:bg-[#1B3C53] hover:text-white transition-colors duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-[#456882] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#1B3C53]">{course.name}</p>
                      <p className="text-sm text-[#456882]">
                        {course.enrollments} элсэлт
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>



      <Footer />
    </div>
  )
}
