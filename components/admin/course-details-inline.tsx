'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { CourseLessons } from '@/components/admin/course-lessons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'

interface EnrollmentItem {
  user?: { name: string; email: string }
  enrolledAt?: string
}

export function AdminCourseDetailsInline({ courseId, onChanged }: { courseId: string; onChanged: () => void }) {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'enrollments' | 'lessons'>('enrollments')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/courses/${courseId}`)
      if (!res.ok) throw new Error('Алдаа гарлаа')
      const data = await res.json()
      setEnrollments(data.enrollments || [])
    } catch (e: any) {
      setError(e.message || 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const filteredEnrollments = useMemo(() => {
    const q = search.toLowerCase()
    return enrollments.filter(e =>
      (e.user?.name || '').toLowerCase().includes(q) ||
      (e.user?.email || '').toLowerCase().includes(q)
    )
  }, [enrollments, search])

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Дэлгэрэнгүй</CardTitle>
          <div className="text-xs text-ink-500">Худалдан авсан: {enrollments.length}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
          <TabsList className="bg-sand-100 rounded-xl p-1">
            <TabsTrigger value="enrollments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-sand-200">
              Худалдан авсан
            </TabsTrigger>
            <TabsTrigger value="lessons" className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-sand-200">
              Хичээлүүд
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrollments">
            <div className="mb-3 relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-ink-500" />
              <Input placeholder="Хэрэглэгч хайх..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="text-sm text-ink-500">Одоогоор хэрэглэгч байхгүй</div>
            ) : (
              <div className="space-y-2">
                {filteredEnrollments.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-sand-200 rounded-xl hover:bg-sand-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-sand-100 flex items-center justify-center text-xs text-ink-700">
                        {(e.user?.name || 'Н').slice(0,1)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-ink-900">{e.user?.name || 'Нэргүй'}</div>
                        <div className="text-xs text-ink-500">{e.user?.email}</div>
                      </div>
                    </div>
                    {e.enrolledAt && (
                      <div className="text-xs text-ink-500">{formatDate(e.enrolledAt)}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lessons">
            {/* CourseLessons refetches lessons itself; pass minimal course object */}
            <CourseLessons course={{ _id: courseId }} onChanged={() => { onChanged(); load() }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
