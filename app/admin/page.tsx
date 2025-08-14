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
  const [recentPayments, setRecentPayments] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all data from MongoDB
      const [usersRes, coursesRes, paymentsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/courses'),
        fetch('/api/payments'),

      ])

      // Log response statuses
      console.log('API Response Statuses:', {
        users: usersRes.status,
        courses: coursesRes.status,
        payments: paymentsRes.status,

      })

      if (usersRes.ok && coursesRes.ok && paymentsRes.ok) {
        const usersData = await usersRes.json()
        const coursesData = await coursesRes.json()
        const paymentsData = await paymentsRes.json()

        // Extract arrays from the responses (handle both direct arrays and {data: array} format)
        const users = Array.isArray(usersData) ? usersData : (usersData.data || [])
        const courses = Array.isArray(coursesData) ? coursesData : (coursesData.data || [])
        const payments = Array.isArray(paymentsData) ? paymentsData : (paymentsData.data || [])

        // Debug logging
        console.log('Dashboard data fetched:', {
          users: users.length,
          courses: courses.length,
          payments: payments.length,
          usersResponse: usersData,
          coursesResponse: coursesData,
          paymentsResponse: paymentsData
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

        // Set recent payments (last 5)
        setRecentPayments(payments.slice(-5).reverse())
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
      title: 'Media Grid',
      description: 'Media grid management',
      icon: FileText,
      href: '/admin/media-grid',
      color: 'bg-indigo-500'
    },
    {
      title: 'Database',
      description: 'Database management and backup',
      icon: FileText,
      href: '/admin/database',
      color: 'bg-red-500'
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

        {/* Quick Actions and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-ink-900">Quick Actions</CardTitle>
            </CardHeader>
                      <CardContent className="pt-0 px-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow min-h-[120px]"
                  onClick={() => window.location.href = action.href}
                >
                  <div className={`p-3 rounded-lg mb-3 ${action.color}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium text-ink-900 text-sm">{action.title}</div>
                </Button>
              ))}
            </div>
          </CardContent>
          </Card>

          {/* Recent Activities with Tabs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-ink-900">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-6 pb-6">
              <div className="flex space-x-1 mb-6 bg-sand-100 p-1 rounded-lg">
                <button 
                  className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'users' 
                      ? 'bg-white text-primary shadow-sm ring-1 ring-sand-200' 
                      : 'text-ink-600 hover:text-ink-800 hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>New Users</span>
                  </div>
                </button>
                <button 
                  className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'payments' 
                      ? 'bg-white text-primary shadow-sm ring-1 ring-sand-200' 
                      : 'text-ink-600 hover:text-ink-800 hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('payments')}
                >
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Payment History</span>
                  </div>
                </button>
              </div>
              
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {recentUsers.length === 0 ? (
                    <p className="text-ink-500 text-center py-4">No users found</p>
                  ) : (
                    recentUsers.map((user) => (
                      <div key={user._id} className="flex items-center justify-between p-3 border border-sand-200 rounded-lg hover:bg-sand-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-sand-200 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-ink-600" />
                          </div>
                          <div>
                            <p className="font-medium text-ink-900 text-sm">{user.displayName || user.email}</p>
                            <p className="text-xs text-ink-500">{user.email}</p>
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
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/admin/users'}>
                    View All Users
                  </Button>
                </div>
              )}
              
              {activeTab === 'payments' && (
                <div className="space-y-4">
                  {recentPayments.length === 0 ? (
                    <p className="text-ink-500 text-center py-4">No payments found</p>
                  ) : (
                    recentPayments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-3 border border-sand-200 rounded-lg hover:bg-sand-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-ink-900 text-sm">${payment.amount || 0}</p>
                            <p className="text-xs text-ink-500">{payment.status || 'pending'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {payment.status || 'pending'}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/payments`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/admin/payments'}>
                    View All Payments
                  </Button>
                </div>
              )}
              
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  )
}
