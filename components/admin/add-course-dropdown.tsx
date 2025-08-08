'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Course {
  _id: string
  title: string
}

export function AddCourseDropdown({ userId, onAdded }: { userId: string; onAdded: () => void }) {
  const [courses, setCourses] = useState<Course[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses?all=true')
        if (res.ok) {
          setCourses(await res.json())
        }
      } catch {}
    }
    fetchCourses()
  }, [])

  const handleAdd = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ $addToSet: { enrolledCourses: selected } })
      })
      if (res.ok) {
        onAdded()
        setSelected('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-2">
      <Label>Курс нэмэх</Label>
      <div className="flex gap-2">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Курс сонгох" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(c => (
              <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={handleAdd} disabled={!selected || loading}>
          {loading ? 'Нэмэж байна...' : 'Нэмэх'}
        </Button>
      </div>
    </div>
  )
}
