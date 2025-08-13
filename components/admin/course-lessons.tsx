'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import * as tus from 'tus-js-client'
import { startBunnyUpload } from '@/lib/bunny/uploader'
import { Progress } from '@/components/ui/progress'

interface Lesson {
  _id?: string
  title: string
  duration: number
  preview?: boolean
}

export function CourseLessons({ course, onChanged, variant = 'default' }: { course: any, onChanged: () => void, variant?: 'default' | 'compact' }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState<number | ''>('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    try {
      const videoId = await startBunnyUpload(file, title, {
        onProgress: (p) => setUploadProgress(p),
      })

      // Save lesson pointing at bunny:VIDEO_ID
      const res = await fetch(`/api/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, duration: Number(duration), courseId: course._id, videoUrl: `bunny:${videoId}` })
      })
      if (!res.ok) throw new Error('Failed to save lesson')
      setTitle('')
      setDuration('')
      onChanged()
      const r2 = await fetch(`/api/courses/${course._id}`)
      if (r2.ok) {
        const data = await r2.json()
        const c = data.course || data
        setLessons(c.lessons || [])
      }
    } catch (e) {
      console.error('Bunny upload failed:', e)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Card className={variant === 'compact' ? 'border-0 bg-transparent shadow-none' : undefined}>
      <CardContent className={variant === 'compact' ? 'pt-0 px-0' : 'pt-4'}>
        <div className={variant === 'compact' ? 'rounded-xl overflow-hidden bg-white divide-y divide-sand-100' : 'space-y-3'}>
          {lessons.map((l, idx) => (
            <div key={l._id || idx} className={variant === 'compact' ? 'flex items-center justify-between px-3 py-3 hover:bg-sand-50 transition-colors' : 'flex items-center justify-between p-2 border rounded'}>
              <div>
                <div className="font-medium">{idx + 1}. {l.title}</div>
                <div className="text-xs text-gray-500">{l.duration} минут</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  const titleNew = prompt('Шинэ гарчиг', l.title) || l.title
                  const durationNew = Number(prompt('Минут', String(l.duration)) || l.duration)
                  const res = await fetch(`/api/lessons/${l._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: titleNew, duration: durationNew }) })
                  if (res.ok) {
                    onChanged()
                    const r = await fetch(`/api/courses/${course._id}`)
                    if (r.ok) {
                      const data = await r.json()
                      const c = data.course || data
                      setLessons(c.lessons || [])
                    }
                  }
                }}>Засах</Button>
                <Button size="sm" variant="destructive" onClick={async () => {
                  if (!l._id) return
                  if (!confirm('Хичээлийг устгах уу?')) return
                  const res = await fetch(`/api/lessons/${l._id}`, { method: 'DELETE' })
                  if (res.ok) {
                    onChanged()
                    setLessons(prev => prev.filter(x => x._id !== l._id))
                  }
                }}>Устгах</Button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-2">
              <Label htmlFor="new-lesson-title">Шинэ хичээлийн гарчиг</Label>
              <Input id="new-lesson-title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="new-lesson-duration">Минут</Label>
              <Input id="new-lesson-duration" type="number" value={duration} onChange={e => setDuration(e.target.value ? Number(e.target.value) : '')} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div className="col-span-2">
              <Label htmlFor="new-lesson-video">Видео файл (Bunny)</Label>
              <input
                id="new-lesson-video"
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Файл сонгох
                </Button>
                <span className="text-sm text-gray-600 truncate max-w-[240px]">
                  {selectedFile ? selectedFile.name : 'Файл сонгогдоогүй'}
                </span>
              </div>
              {uploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} />
                  <div className="text-xs text-gray-600 mt-1">{uploadProgress}%</div>
                </div>
              )}
            </div>
            <div className="space-x-2 flex justify-end">
              <Button type="button" variant="outline" onClick={handleAdd} disabled={!title || !duration}>Хичээл нэмэх</Button>
              <Button
                type="button"
                onClick={() => selectedFile && handleUpload(selectedFile)}
                disabled={uploading || !selectedFile || !title || !duration}
              >
                {uploading ? 'Байршуулж байна...' : 'Видео байршуулах + нэмэх'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
