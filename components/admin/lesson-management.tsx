'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Play, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Lesson {
  _id: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  preview: boolean
  createdAt: string
}

interface LessonManagementProps {
  courseId: string
  onLessonsChange?: () => void
}

export function LessonManagement({ courseId, onLessonsChange }: LessonManagementProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: '',
    preview: false
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLessons()
  }, [courseId])

  const fetchLessons = async () => {
    try {
      const response = await fetch(`/api/lessons?courseId=${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setLessons(data.lessons || [])
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = async () => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLesson,
          courseId,
          duration: Number(newLesson.duration),
          order: Number(newLesson.order)
        })
      })

      if (response.ok) {
        toast({
          title: 'Амжилттай',
          description: 'Хичээл амжилттай үүсгэгдлээ'
        })
        setShowDialog(false)
        setNewLesson({
          title: '',
          description: '',
          videoUrl: '',
          duration: '',
          order: '',
          preview: false
        })
        fetchLessons()
        onLessonsChange?.()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Хичээл үүсгэхэд алдаа гарлаа')
      }
    } catch (error) {
      toast({
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Хичээл үүсгэхэд алдаа гарлаа',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateLesson = async () => {
    if (!editingLesson) return

    try {
      const response = await fetch(`/api/lessons/${editingLesson._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLesson.title,
          description: newLesson.description,
          videoUrl: newLesson.videoUrl, // Explicitly include videoUrl
          duration: Number(newLesson.duration),
          order: Number(newLesson.order),
          preview: newLesson.preview
        })
      })

      if (response.ok) {
        toast({
          title: 'Амжилттай',
          description: 'Хичээл амжилттай шинэчлэгдлээ'
        })
        setShowDialog(false)
        setEditingLesson(null)
        setNewLesson({
          title: '',
          description: '',
          videoUrl: '',
          duration: '',
          order: '',
          preview: false
        })
        fetchLessons()
        onLessonsChange?.()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Хичээл шинэчлэхэд алдаа гарлаа')
      }
    } catch (error) {
      toast({
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Хичээл шинэчлэхэд алдаа гарлаа',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Хичээлийг устгахдаа итгэлтэй байна уу?')) return

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Амжилттай',
          description: 'Хичээл амжилттай устгагдлаа'
        })
        fetchLessons()
        onLessonsChange?.()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Хичээл устгахад алдаа гарлаа')
      }
    } catch (error) {
      toast({
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Хичээл устгахад алдаа гарлаа',
        variant: 'destructive'
      })
    }
  }

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setNewLesson({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration.toString(),
      order: lesson.order.toString(),
      preview: lesson.preview
    })
    setShowDialog(true)
  }

  const openCreateDialog = () => {
    setEditingLesson(null)
    setNewLesson({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: '',
      preview: false
    })
    setShowDialog(true)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Хичээлүүд</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Уншиж байна...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Хичээлүүд ({lessons.length})</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-[#1B3C53] hover:bg-[#456882]">
              <Plus className="w-4 h-4 mr-2" />
              Хичээл нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? 'Хичээл засах' : 'Шинэ хичээл нэмэх'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Гарчиг</Label>
                <Input
                  id="title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="Хичээлийн гарчиг"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Тайлбар</Label>
                <Textarea
                  id="description"
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  placeholder="Хичээлийн тайлбар"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Видео URL (Bunny.net)</Label>
                <Input
                  id="videoUrl"
                  value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                  placeholder="bunny:video-id эсвэл https://..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Үргэлжлэх хугацаа (мин)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                    placeholder="15"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Дараалал</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newLesson.order}
                    onChange={(e) => setNewLesson({ ...newLesson, order: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preview">Үнэгүй үзэх</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preview"
                      checked={newLesson.preview}
                      onCheckedChange={(checked) => setNewLesson({ ...newLesson, preview: checked })}
                    />
                    <Label htmlFor="preview">Үнэгүй үзэх боломжтой</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Цуцлах
                </Button>
                <Button
                  onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                  className="bg-[#1B3C53] hover:bg-[#456882]"
                >
                  {editingLesson ? 'Шинэчлэх' : 'Үүсгэх'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Хичээл байхгүй байна. Хичээл нэмж эхлэнэ үү.
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {lesson.preview ? (
                      <Play className="w-5 h-5 text-green-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{lesson.title}</h4>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      <span>{lesson.duration} мин</span>
                      <span>Дараалал: {lesson.order}</span>
                      {lesson.preview && (
                        <Badge variant="secondary" className="text-xs">
                          Үнэгүй үзэх
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(lesson)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
