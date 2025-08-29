"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { BookOpen, Clock, Trophy, Play } from "lucide-react"
import type { Course } from "@/lib/types"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"

interface CourseWithProgress extends Course {
  progress?: number
  completedLessons?: number
  enrollmentId?: string
}

interface Stats {
  enrolledCourses: number
  completedLessons: number
  totalProgress: number
  averageProgress: number
}

export default function DashboardPage() {
  const { refreshUser } = useAuth()
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Check authentication
        const authCheck = await fetch('/api/auth/me')
        
        if (!authCheck.ok) {
          router.push('/login')
          return
        }

        // Fetch user-specific courses and stats in parallel
        const [coursesRes, statsRes] = await Promise.all([
          fetch('/api/auth/my-courses'),
          fetch('/api/auth/my-stats')
        ])

        if (coursesRes.ok && statsRes.ok) {
          const [coursesData, statsData] = await Promise.all([
            coursesRes.json(),
            statsRes.json()
          ])

          console.log("Dashboard courses data:", coursesData)
          console.log("Dashboard stats data:", statsData)

          setCourses(coursesData.courses || [])
          setStats(statsData.stats)
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  // Refresh dashboard data when page becomes visible (e.g., returning from learn page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh data
        const fetchDashboardData = async () => {
          try {
            const [coursesRes, statsRes] = await Promise.all([
              fetch('/api/auth/my-courses'),
              fetch('/api/auth/my-stats')
            ])

            if (coursesRes.ok && statsRes.ok) {
              const [coursesData, statsData] = await Promise.all([
                coursesRes.json(),
                statsRes.json()
              ])

              setCourses(coursesData.courses || [])
              setStats(statsData.stats)
            }
          } catch (error) {
            console.error("Dashboard refresh error:", error)
          }
        }
        fetchDashboardData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])



  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Ачааллаж байна...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Хяналтын самбар</h1>
          <p className="text-muted-foreground">Тавтай морилно уу! Таны суралцахуйн явц энд байна.</p>


        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Элссэн хичээлүүд</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.enrolledCourses || 0}</div>
              <Progress value={Math.min(((stats?.enrolledCourses || 0) / 10) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Дууссан хичээлүүд</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedLessons || 0}</div>
              <Progress value={stats?.completedLessons ? Math.min((stats.completedLessons / 50) * 100, 100) : 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Нийт явц</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProgress || 0}%</div>
              <Progress value={stats?.totalProgress || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Дундаж явц</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageProgress || 0}%</div>
              <Progress value={stats?.averageProgress || 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>



        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Миний элссэн хичээлүүд ({stats?.enrolledCourses || 0})</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  setLoading(true)
                  const [coursesRes, statsRes] = await Promise.all([
                    fetch('/api/auth/my-courses'),
                    fetch('/api/auth/my-stats')
                  ])

                  if (coursesRes.ok && statsRes.ok) {
                    const [coursesData, statsData] = await Promise.all([
                      coursesRes.json(),
                      statsRes.json()
                    ])

                    setCourses(coursesData.courses || [])
                    setStats(statsData.stats)
                  }
                } catch (error) {
                  console.error("Manual refresh error:", error)
                } finally {
                  setLoading(false)
                }
              }}
            >
              🔄 Шинэчлэх
            </Button>
          </div>
          




          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Төлөв</span>
                        <span>{course.progress && course.progress > 0 ? `${course.progress}%` : 'Эхлээгүй'}</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                       {course.completedLessons !== undefined && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Дууссан хичээл: {course.completedLessons}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Button
                        size="sm"
                        className="bg-[#5B7FFF] hover:bg-[#4A6FE7]"
                        asChild
                      >
                        <Link href={`/courses/${course._id}`}>
                          Үргэлжлүүлэх
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Одоогоор элссэн хичээл байхгүй</h3>
                <p className="text-muted-foreground mb-4">Хичээлд элсэж суралцахын аялалаа эхлүүлнэ үү.</p>
                <Button asChild className="bg-[#5B7FFF] hover:bg-[#4A6FE7]">
                  <Link href="/courses">Боломжтой хичээлүүдийг үзэх</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
