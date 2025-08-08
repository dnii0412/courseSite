'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Filter, RefreshCw, User, BookOpen, Clock, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'

const getStatusBadge = (status: string, isExpired?: boolean) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Амжилттай</Badge>
    case 'pending':
      if (isExpired) {
        return <Badge className="bg-orange-100 text-orange-800 flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Хугацаа дууссан
        </Badge>
      }
      return <Badge className="bg-yellow-100 text-yellow-800">Хүлээгдэж буй</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">Амжилтгүй</Badge>
    case 'cancelled':
      return <Badge className="bg-gray-100 text-gray-800">Цуцлагдсан</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments')
      if (!res.ok) throw new Error('Алдаа гарлаа')
      const data = await res.json()
      setPayments(data)
    } catch (err: any) {
      setError(err.message || 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExpiredPayments = async () => {
    try {
      const res = await fetch('/api/payments/expired', {
        method: 'POST'
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data.message)
        // Refresh the payments list
        await fetchPayments()
      }
    } catch (error) {
      console.error('Error updating expired payments:', error)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    expired: payments.filter(p => p.isExpired).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Төлбөрүүд
            </h1>
            <p className="text-gray-600">
              Бүх төлбөрийн жагсаалт ба удирдлага
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Нийт</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Амжилттай</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Хүлээгдэж буй</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Амжилтгүй</p>
                    <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Төлбөрүүд</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleUpdateExpiredPayments}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Хугацаа дууссан төлбөрүүдийг шинэчлэх
                  </Button>
                  <Button variant="outline" onClick={fetchPayments}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Шинэчлэх
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Хэрэглэгч, курс хайх..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="border rounded-md px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Бүх статус</option>
                  <option value="completed">Амжилттай</option>
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="failed">Амжилтгүй</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Уншиж байна...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Төлбөр олдсонгүй
                    </div>
                  ) : (
                    filteredPayments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <p className="text-sm font-medium leading-none">
                                {payment.userDisplayName}
                              </p>
                              {payment.user?.email && (
                                <span className="text-xs text-gray-500">
                                  ({payment.user.email})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-muted-foreground">
                                {payment.courseDisplayName}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {payment.timeSinceCreated} өмнө
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ₮{payment.amount?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.currency || 'MNT'}
                            </p>
                          </div>
                          {getStatusBadge(payment.status, payment.isExpired)}
                          <div className="text-sm text-muted-foreground">
                            {payment.createdAt ? formatDate(payment.createdAt) : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
