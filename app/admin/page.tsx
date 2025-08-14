'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  UserPlus, 
  FileText, 
  Settings,
  Clock,
  Eye
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    recentEnrollments: 0
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentCourses, setRecentCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all data from MongoDB
      const [usersRes, coursesRes, paymentsRes, enrollmentsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/courses'),
        fetch('/api/payments'),
        fetch('/api/enrollments/check')
      ])

      // Log response statuses
      console.log('API Response Statuses:', {
        users: usersRes.status,
        courses: coursesRes.status,
        payments: paymentsRes.status,
        enrollments: enrollmentsRes.status
      })

      if (usersRes.ok && coursesRes.ok && paymentsRes.ok) {
        const users = await usersRes.json()
        const coursesData = await coursesRes.json()
        const payments = await paymentsRes.json()

        // Extract courses array from the response
        const courses = coursesData.data || coursesData || []

        // Debug logging
        console.log('Dashboard data fetched:', {
          users: users.length,
          courses: courses.length,
          payments: payments.length,
          coursesResponse: coursesData
        })

        // Calculate stats
        const totalUsers = users.length
        const totalCourses = courses.length
        const totalRevenue = payments
          .filter((p: any) => p.status === 'completed')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        
        // Get recent enrollments (this month)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const recentEnrollments = payments.filter((p: any) => {
          if (!p.createdAt) return false
          const paymentDate = new Date(p.createdAt)
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear
        }).length

        setStats({
          totalUsers,
          totalCourses,
          totalRevenue,
          recentEnrollments
        })

        // Set recent users (last 5)
        setRecentUsers(users.slice(-5).reverse())
        
        // Set recent courses (last 5)
        setRecentCourses(courses.slice(-5).reverse())
      } else {
        // Log which APIs failed
        console.error('Some APIs failed:', {
          users: usersRes.ok,
          courses: coursesRes.ok,
          payments: paymentsRes.ok
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Хэрэглэгч нэмэх',
      description: 'Шинэ хэрэглэгч үүсгэх',
      icon: UserPlus,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Курс нэмэх',
      description: 'Шинэ сургалтын курс үүсгэх',
      icon: Plus,
      href: '/admin/courses',
      color: 'bg-green-500'
    },
    {
      title: 'Төлбөр харах',
      description: 'Төлбөрийн мэдээлэл',
      icon: DollarSign,
      href: '/admin/payments',
      color: 'bg-yellow-500'
    },
    {
      title: 'Тохиргоо',
      description: 'Системийн тохиргоо',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-ink-600">Уншиж байна...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900">Админ удирдлага</h1>
          <p className="text-ink-600 mt-2">Системийн ерөнхий мэдээлэл ба удирдлага</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-500">Нийт хэрэглэгч</p>
                  <p className="text-3xl font-bold text-ink-900">{stats.recentEnrollments}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-500">Нийт курс</p>
                  <p className="text-3xl font-bold text-ink-900">{stats.totalCourses}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-500">Нийт орлого</p>
                  <p className="text-3xl font-bold text-ink-900">₮{stats.totalRevenue?.toLocaleString() || 0}</p>
                  
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-ink-900">Хурдан үйлдлүүд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                  onClick={() => window.location.href = action.href}
                >
                  <div className={`p-3 rounded-xl mb-3 ${action.color}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium text-ink-900">{action.title}</div>
                  <div className="text-sm text-ink-500 mt-1">{action.description}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-ink-900">Сүүлийн хэрэглэгчид</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.length === 0 ? (
                  <p className="text-ink-500 text-center py-4">Хэрэглэгч олдсонгүй</p>
                ) : (
                  recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 border border-sand-200 rounded-xl hover:bg-sand-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sand-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-ink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{user.displayName || user.email}</p>
                          <p className="text-sm text-ink-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {user.role || 'user'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/users/${user._id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/users'}>
                  Бүх хэрэглэгчийг харах
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-ink-900">Сүүлийн курсүүд</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.length === 0 ? (
                  <p className="text-ink-500 text-center py-4">Курс олдсонгүй</p>
                ) : (
                  recentCourses.map((course) => (
                    <div key={course._id} className="flex items-center justify-between p-3 border border-sand-200 rounded-xl hover:bg-sand-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{course.title}</p>
                          <p className="text-sm text-ink-500">{course.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.status || 'active'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/courses/${course._id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/courses'}>
                  Бүх курсыг харах
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
