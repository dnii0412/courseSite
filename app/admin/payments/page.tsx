'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Filter, RefreshCw, User, BookOpen, Clock, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'
// removed FiltersBar per request

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

  const handleExport = () => {
    const rows = filteredPayments.map((p) => ({
      Date: p.createdAt ? new Date(p.createdAt).toISOString() : '',
      User: p.userDisplayName || '',
      Email: p.user?.email || '',
      Course: p.courseDisplayName || '',
      Amount: p.amount ?? 0,
      Currency: p.currency || 'MNT',
      Status: p.status,
      Expired: p.isExpired ? 'yes' : 'no',
    }))

    const headers = Object.keys(rows[0] || { Date: '', User: '', Email: '', Course: '', Amount: 0, Currency: '', Status: '', Expired: '' })
    const esc = (val: any) => {
      const s = String(val ?? '')
      if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"'
      return s
    }
    const csv = [headers.join(',')]
      .concat(rows.map((r) => headers.map((h) => esc((r as any)[h])).join(',')))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments_export_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    expired: payments.filter(p => p.isExpired).length
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6">

          

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-500">Нийт</p>
                    <p className="text-2xl font-bold text-ink-900">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-sand-100 rounded-lg">
                    <User className="w-4 h-4 text-ink-900" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-500">Амжилттай</p>
                    <p className="text-2xl font-bold text-ink-900">{stats.completed}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{background:'#E8F7F1'}}>
                    <BookOpen className="w-4 h-4" style={{color:'#1EA97C'}} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-500">Хүлээгдэж буй</p>
                    <p className="text-2xl font-bold text-ink-900">{stats.pending}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{background:'#FFF6E6'}}>
                    <Clock className="w-4 h-4" style={{color:'#C28313'}} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-500">Амжилтгүй</p>
                    <p className="text-2xl font-bold text-ink-900">{stats.failed}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{background:'#FFEDEB'}}>
                    <AlertTriangle className="w-4 h-4" style={{color:'#C2392A'}} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Төлбөрүүд</CardTitle>
                
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-ink-500" />
                  <Input 
                    placeholder="Хэрэглэгч, курс хайх..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="border border-sand-200 rounded-xl px-3 py-2 text-sm bg-white text-ink-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Бүх статус</option>
                  <option value="completed">Амжилттай</option>
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="failed">Амжилтгүй</option>
                </select>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={fetchPayments}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Шинэчлэх
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
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
                      <div key={payment._id} className="flex items-center justify-between p-4 border border-sand-200 rounded-2xl hover:bg-sand-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-ink-500" />
                              <p className="text-sm font-medium leading-none">
                                {payment.userDisplayName}
                              </p>
                              {payment.user?.email && (
                                <span className="text-xs text-ink-500">
                                  ({payment.user.email})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <BookOpen className="w-4 h-4 text-ink-500" />
                              <p className="text-sm text-ink-500">
                                {payment.courseDisplayName}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-4 h-4 text-ink-500" />
                              <p className="text-xs text-ink-500">
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
                            <p className="text-xs text-ink-500">
                              {payment.currency || 'MNT'}
                            </p>
                          </div>
                          {getStatusBadge(payment.status, payment.isExpired)}
                          <div className="text-sm text-ink-500">
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
  )
}
