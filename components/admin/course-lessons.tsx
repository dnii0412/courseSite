'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface Lesson {
  _id?: string
  title: string
  duration: number
  preview?: boolean
  description?: string
  videoUrl?: string
}

export function CourseLessons({ course, onChanged }: { course: any, onChanged: () => void }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [bunnyId, setBunnyId] = useState('')
  const [preview, setPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDuration, setEditDuration] = useState<number | ''>('')
  const [editPreview, setEditPreview] = useState(false)
  const [editBunnyId, setEditBunnyId] = useState('')

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
    setError(null)
    // Accept Bunny full URL or raw ID and normalize to embed URL or bunny:ID
    const extractedId = (() => {
      const input = (bunnyId || '').trim()
      if (!input) return ''
      // Prefer /play/ when both patterns exist in the pasted value
      const mPlay = input.match(/\/play\/[^/]+\/([^/?#]+)/)
      if (mPlay?.[1]) return mPlay[1]
      const m = input.match(/\/embed\/[^/]+\/([^/?#]+)/)
      if (m?.[1]) return m[1]
      const m2 = input.match(/^bunny:([^/?#]+)/)
      if (m2?.[1]) return m2[1]
      return input
    })()
    const finalVideoUrl = extractedId
      ? (process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ? `https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${extractedId}?autoplay=false` : `bunny:${extractedId}`)
      : ''

    if (!course?._id || !title || !duration || !finalVideoUrl) {
      setError('Бүх талбарыг бөглөнө үү')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, duration: Number(duration), courseId: course._id, videoUrl: finalVideoUrl, preview, description })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Хичээл үүсгэхэд алдаа')
        return
      }
      setTitle('')
      setDuration('')
      setDescription('')
      setPreview(false)
      setBunnyId('')
      onChanged()
      // reload lessons
      const r = await fetch(`/api/courses/${course._id}`)
      if (r.ok) {
        const data2 = await r.json()
        const c = data2.course || data2
        setLessons(c.lessons || [])
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {lessons.map((l, idx) => {
            const isEditing = editingId === l._id
            return (
              <div key={l._id || idx} className="flex items-center justify-between p-2 border rounded gap-2">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-2">
                        <Label>Гарчиг</Label>
                        <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                      </div>
                      <div>
                        <Label>Минут</Label>
                        <Input type="number" min={1} value={editDuration} onChange={e => setEditDuration(e.target.value ? Number(e.target.value) : '')} />
                      </div>
                      <div className="col-span-2">
                        <Label>Bunny видео ID</Label>
                        <Input value={editBunnyId} onChange={e => setEditBunnyId(e.target.value)} placeholder="VIDEO_ID" />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={editPreview} onChange={e => setEditPreview(e.target.checked)} />
                          Үнэгүй үзэх
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">{idx + 1}. {l.title}</div>
                      <div className="text-xs text-gray-500">{l.duration} минут</div>
                      {!!l.videoUrl && (
                        <div className="text-xs text-gray-500 break-all mt-1">Видео: {l.videoUrl}</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (!l._id) return
                          const extractedId = (() => {
                            const input = (editBunnyId || '').trim()
                            if (!input) return ''
                            const mPlay = input.match(/\/play\/[^/]+\/([^/?#]+)/)
                            if (mPlay?.[1]) return mPlay[1]
                            const m = input.match(/\/embed\/[^/]+\/([^/?#]+)/)
                            if (m?.[1]) return m[1]
                            const m2 = input.match(/^bunny:([^/?#]+)/)
                            if (m2?.[1]) return m2[1]
                            return input
                          })()
                          const finalVideoUrl = extractedId
                            ? (process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ? `https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${extractedId}?autoplay=false` : `bunny:${extractedId}`)
                            : ''
                          if (!editTitle || !editDuration || !finalVideoUrl) {
                            setError('Бүх талбарыг бөглөнө үү')
                            return
                          }
                          const res = await fetch(`/api/lessons/${l._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: editTitle, duration: Number(editDuration), preview: editPreview, videoUrl: finalVideoUrl })
                          })
                          const ok = res.ok
                          if (!ok) {
                            const d = await res.json().catch(() => ({}))
                            setError(d?.error || 'Засахад алдаа гарлаа')
                            return
                          }
                          setEditingId(null)
                          setEditTitle('')
                          setEditDuration('')
                          setEditPreview(false)
                          setEditBunnyId('')
                          onChanged()
                          const r = await fetch(`/api/courses/${course._id}`)
                          if (r.ok) {
                            const data2 = await r.json()
                            const c = data2.course || data2
                            setLessons(c.lessons || [])
                          }
                        }}
                      >Хадгалах</Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingId(null); }}>Цуцлах</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingId(l._id || null)
                        setEditTitle(l.title)
                        setEditDuration(l.duration)
                        setEditPreview(!!l.preview)
                        // try to infer previous bunny id from stored videoUrl (supports embed/play/bunny:)
                        const m = (l.videoUrl || '').match(/\/play\/[^/]+\/([^/?#]+)/) || (l.videoUrl || '').match(/\/embed\/[^/]+\/([^/?#]+)/) || (l.videoUrl || '').match(/^bunny:([^/?#]+)/)
                        setEditBunnyId(m?.[1] || '')
                      }}>Засах</Button>
                      <Button size="sm" variant="destructive" onClick={async () => {
                        if (!l._id) return
                        if (!confirm('Энэ хичээлийг устгах уу?')) return
                        const res = await fetch(`/api/lessons/${l._id}`, { method: 'DELETE' })
                        if (!res.ok) {
                          const d = await res.json().catch(() => ({}))
                          setError(d?.error || 'Устгахад алдаа гарлаа')
                          return
                        }
                        onChanged()
                        const r = await fetch(`/api/courses/${course._id}`)
                        if (r.ok) {
                          const data2 = await r.json()
                          const c = data2.course || data2
                          setLessons(c.lessons || [])
                        }
                      }}>Устгах</Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              <Label htmlFor="new-lesson-title">Шинэ хичээлийн гарчиг</Label>
              <Input id="new-lesson-title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="new-lesson-duration">Минут</Label>
              <Input id="new-lesson-duration" type="number" min={1} value={duration} onChange={e => setDuration(e.target.value ? Number(e.target.value) : '')} required />
            </div>
            <div className="col-span-2">
              <Label htmlFor="new-lesson-bunny">Bunny видео ID</Label>
              <Input id="new-lesson-bunny" value={bunnyId} onChange={e => setBunnyId(e.target.value)} placeholder="VIDEO_ID эсвэл Bunny URL" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={preview} onChange={e => setPreview(e.target.checked)} />
                Үнэгүй үзэх
              </label>
            </div>
            <div className="col-span-6">
              <Label htmlFor="new-lesson-description">Тайлбар</Label>
              <Textarea id="new-lesson-description" placeholder="Хичээлийн тайлбар" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleAdd} disabled={submitting}>{submitting ? 'Нэмэж байна...' : 'Хичээл нэмэх'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
