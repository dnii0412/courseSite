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



  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching dashboard data...")

        // Refresh user data first to get latest enrollment info
        await refreshUser()

        // Check if user is authenticated
        const authCheck = await fetch("/api/auth/me")
        console.log("🔐 Auth check status:", authCheck.status)

        if (!authCheck.ok) {
          console.log("❌ User not authenticated")
          setLoading(false)
          return
        }

        const [coursesRes, statsRes] = await Promise.all([
          fetch("/api/auth/my-courses"),
          fetch("/api/auth/my-stats")
        ])

        console.log("📊 Courses response status:", coursesRes.status)
        console.log("📈 Stats response status:", statsRes.status)

        const coursesData = await coursesRes.json()
        const statsData = await statsRes.json()

        console.log("📚 Courses data:", coursesData)
        console.log("📊 Stats data:", statsData)

        setCourses(coursesData.courses || [])
        setStats(statsData.stats || statsData)
      } catch (error) {
        console.error("❌ Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>


        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.enrolledCourses || 0}</div>
              <Progress value={Math.min(((stats?.enrolledCourses || 0) / 10) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Status</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length > 0 ? 'Active' : 'No Courses'}</div>
              <Progress value={courses.length > 0 ? 100 : 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>



        {/* My Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">My Enrolled Courses ({courses.length})</h2>

          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Status</span>
                        <span>{course.progress && course.progress > 0 ? `${course.progress}%` : 'Not Started'}</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Button
                        size="sm"
                        className="bg-[#5B7FFF] hover:bg-[#4A6FE7]"
                        asChild
                      >
                        <Link href={`/courses/${course._id}`}>
                          Continue
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No enrolled courses yet</h3>
                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course.</p>
                <Button asChild className="bg-[#5B7FFF] hover:bg-[#4A6FE7]">
                  <Link href="/courses">Browse Available Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
