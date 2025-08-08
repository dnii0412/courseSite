'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { CourseLessons } from '@/components/admin/course-lessons'

interface EnrollmentItem {
  user?: { name: string; email: string }
  enrolledAt?: string
}

export function AdminCourseDetailsInline({ courseId, onChanged }: { courseId: string; onChanged: () => void }) {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <Card className="mt-4">
      <CardContent className="pt-4 space-y-6">
        <div>
          <div className="text-sm font-medium mb-2">Худалдан авсан хэрэглэгчид</div>
          {loading ? (
            <div className="text-sm text-gray-500">Ачаалж байна...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : enrollments.length === 0 ? (
            <div className="text-sm text-gray-500">Одоогоор хэрэглэгч байхгүй</div>
          ) : (
            <div className="space-y-2">
              {enrollments.map((e, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{e.user?.name || 'Нэргүй'}</div>
                    <div className="text-xs text-gray-500">{e.user?.email}</div>
                  </div>
                  {e.enrolledAt && (
                    <div className="text-xs text-gray-500">{formatDate(e.enrolledAt)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Хичээлүүд</div>
          {/* CourseLessons refetches lessons itself; pass minimal course object */}
          <CourseLessons course={{ _id: courseId }} onChanged={() => { onChanged(); load() }} />
        </div>
      </CardContent>
    </Card>
  )
}
