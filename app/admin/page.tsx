"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserPlus,
  Plus,
  Database,
  BarChart3,
  Star,
  Settings,
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  thisMonthEnrollments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    thisMonthEnrollments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        // Not authenticated, redirect to login
        router.push("/admin/login")
        return
      }
      
      const data = await response.json()
      if (data.user.role !== "admin") {
        // Not admin, redirect to login
        router.push("/admin/login")
        return
      }
      
      // Authentication successful, fetch stats
      setAuthLoading(false)
      fetchStats()
    } catch (error) {

      router.push("/admin/login")
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Хэрэглэгч нэмэх",
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/users",
    },
    {
      title: "Курс нэмэх",
      icon: Plus,
      color: "bg-green-500",
      href: "/admin/courses",
    },
    {
      title: "Төлбөр харах",
      icon: DollarSign,
      color: "bg-yellow-500",
      href: "/admin/payments",
    },
    {
      title: "Media Grid",
      icon: Database,
      color: "bg-purple-500",
      href: "/admin/media-grid",
    },
    {
      title: "Database",
      icon: Database,
      color: "bg-red-500",
      href: "/admin/database",
    },
    {
      title: "Тохиргоо",
      icon: Settings,
      color: "bg-purple-500",
      href: "/admin/settings",
    },
    {
      title: "Статистик тохиргоо",
      icon: BarChart3,
      color: "bg-cyan-500",
      href: "/admin/stats",
    },
    {
      title: "Ягаад бид? Тохиргоо",
      icon: Star,
      color: "bg-pink-500",
      href: "/admin/features",
    },
  ]

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Админ удирдлага</h1>
        <p className="text-gray-600">Системийн ерөнхий мэдээлэл ба удирдлага</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Нийт хэрэглэгч</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Нийт курс</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Нийт орлого</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₮{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Энэ сарын бүртгүүл</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                      onClick={() => (window.location.href = action.href)}
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs text-center">{action.title}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  New Users
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="mt-4">
                <div className="text-center py-8 text-gray-500">No users found</div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Users
                </Button>
              </TabsContent>
              <TabsContent value="payments" className="mt-4">
                <div className="text-center py-8 text-gray-500">No payments found</div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Payments
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
