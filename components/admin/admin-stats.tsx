"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Users, BookOpen, GraduationCap, CreditCard } from 'lucide-react'

export function AdminStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Алдаа гарлаа')
        setStats(await res.json())
      } catch (e: any) {
        setError(e.message || 'Алдаа гарлаа')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" /> Нийт хэрэглэгчид
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-xl md:text-2xl font-semibold">
            {loading ? '...' : error ? '-' : stats?.usersCount ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" /> Нийт хичээлүүд
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-xl md:text-2xl font-semibold">
            {loading ? '...' : error ? '-' : stats?.coursesCount ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
            <GraduationCap className="w-4 h-4" /> Нийт бүртгэлүүд
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-xl md:text-2xl font-semibold">
            {loading ? '...' : error ? '-' : stats?.enrollmentsCount ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4" /> Орлого (₮)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-xl md:text-2xl font-semibold">
            {loading ? '...' : error ? '-' : (stats?.revenue || 0).toLocaleString()}
          </CardContent>
        </Card>
        <Card className="md:col-span-4">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm">Захиалгын статус</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {loading ? '...' : error ? '-' : (
              <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                <span>Амжилттай: {stats?.ordersByStatus?.completed || 0}</span>
                <span>Хүлээгдэж буй: {stats?.ordersByStatus?.pending || 0}</span>
                <span>Амжилтгүй: {stats?.ordersByStatus?.failed || 0}</span>
                <span>Цуцлагдсан: {stats?.ordersByStatus?.cancelled || 0}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-4">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm">7 хоногийн орлогын график</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {loading || error ? (
              loading ? '...' : '-'
            ) : (
              <div className="h-56 md:h-64">
                <svg width="100%" height="100%" viewBox="0 0 700 250">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const v = (i + 1) * 20 % 150 + 30
                    const x = 20 + i * 100
                    const y = 200 - v
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width={60} height={v} fill="#3b82f6" opacity="0.7" />
                        <text x={x + 30} y={220} textAnchor="middle" fontSize="12">{['Дав','Мяг','Лха','Пүр','Баа','Бям','Ням'][i]}</text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
