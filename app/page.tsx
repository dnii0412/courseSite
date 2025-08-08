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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Онлайн сургалтын төв
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Мэргэжлийн багш нараас суралцаж, шинэ ур чадвар эзэмшээрэй
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/courses">Хичээлүүд үзэх</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/register">Бүртгүүлэх</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Манай сургалтын төвийн статистик
          </h2>
          <p className="text-gray-600">
            Олон мянган сурагч манай платформ дээр суралцаж байна
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Нийт орлого
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₮{reportData.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{reportData.monthlyGrowth}% өнгөрсөн сартай харьцуулахад
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Нийт сурагч
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalStudents.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{reportData.monthlyGrowth}% өнгөрсөн сартай харьцуулахад
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Нийт сургалт
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Идэвхтэй сургалтууд
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Дуусгах түвшин
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.completionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Дундаж дуусгах түвшин
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Хамгийн түгээмэл сургалтууд
          </h2>
          <p className="text-gray-600">
            Олон сурагчдын сонгосон хичээлүүд
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Топ хичээлүүд</CardTitle>
              <div className="flex items-center space-x-2">
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 хоног</SelectItem>
                    <SelectItem value="30">30 хоног</SelectItem>
                    <SelectItem value="90">90 хоног</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  График
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.popularCourses.map((course, index) => (
                <div key={course.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.enrollments} элсэлт
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₮{course.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Яагаад манай платформыг сонгох вэ?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="w-12 h-12 mx-auto text-blue-600" />
              <CardTitle>Олон төрлийн хичээл</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Технологи, бизнес, урлаг гэх мэт олон салбарын хичээлүүд
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Play className="w-12 h-12 mx-auto text-blue-600" />
              <CardTitle>Видео хичээл</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Өндөр чанартай видео хичээлүүдийг хүссэн цагтаа үзээрэй
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-blue-600" />
              <CardTitle>Мэргэжлийн багш нар</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Туршлагатай, мэргэжлийн багш нараас суралцаарай
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 mx-auto text-blue-600" />
              <CardTitle>Гэрчилгээ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
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
