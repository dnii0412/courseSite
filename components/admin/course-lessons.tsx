'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Lesson {
  _id?: string
  title: string
  duration: number
  preview?: boolean
}

export function CourseLessons({ course, onChanged }: { course: any, onChanged: () => void }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState<number | ''>('')

  useEffect(() => {
    const load = async () => {
      if (!course?._id) return
      const res = await fetch(`/api/courses/${course._id}`)
      if (res.ok) {
        const data = await res.json()
        const c = data.course || data
        setLessons(c.lessons || [])
      }
    }
    load()
  }, [course?._id])

  const handleAdd = async () => {
    if (!course?._id || !title || !duration) return
    const res = await fetch(`/api/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, duration: Number(duration), courseId: course._id })
    })
    if (res.ok) {
      setTitle('')
      setDuration('')
      onChanged()
      // reload lessons
      const r = await fetch(`/api/courses/${course._id}`)
      if (r.ok) {
        const data = await r.json()
        const c = data.course || data
        setLessons(c.lessons || [])
      }
    }
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {lessons.map((l, idx) => (
            <div key={l._id || idx} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{idx + 1}. {l.title}</div>
                <div className="text-xs text-gray-500">{l.duration} минут</div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Label htmlFor="new-lesson-title">Шинэ хичээлийн гарчиг</Label>
              <Input id="new-lesson-title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="new-lesson-duration">Минут</Label>
              <Input id="new-lesson-duration" type="number" value={duration} onChange={e => setDuration(e.target.value ? Number(e.target.value) : '')} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleAdd}>Хичээл нэмэх</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
