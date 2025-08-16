'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, BookOpen } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface Subcourse {
  _id: string
  title: string
  description: string
  order: number
}

interface AddLessonWithSubcourseProps {
  courseId: string
  onChanged: () => void
}

export function AddLessonWithSubcourse({ courseId, onChanged }: AddLessonWithSubcourseProps) {
  const [subcourses, setSubcourses] = useState<Subcourse[]>([])
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedSubcourseId, setSelectedSubcourseId] = useState('')
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoId: '',
    duration: '',
    order: '',
    preview: false,
  })

  // Fetch subcourses for the course
  useEffect(() => {
    async function fetchSubcourses() {
      try {
        const res = await fetch(`/api/subcourses?courseId=${courseId}`)
        if (res.ok) {
          const data = await res.json()
          setSubcourses(data)
          // Auto-select first subcourse if available
          if (data.length > 0 && !selectedSubcourseId) {
            setSelectedSubcourseId(data[0]._id)
          }
        }
      } catch (error) {
        console.error('Error fetching subcourses:', error)
      }
    }
    
    if (courseId && showDialog) {
      fetchSubcourses()
    }
  }, [courseId, showDialog, selectedSubcourseId])

  async function handleCreateLesson() {
    if (!selectedSubcourseId) {
      alert('Дэд хичээл сонгоно уу')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLesson,
          subcourseId: selectedSubcourseId,
          duration: Number(newLesson.duration),
          order: Number(newLesson.order) || 0,
        }),
      })
      
      if (!res.ok) throw new Error('Хичээл үүсгэхэд алдаа гарлаа')
      
      setShowDialog(false)
      setNewLesson({
        title: '',
        description: '',
        videoUrl: '',
        videoId: '',
        duration: '',
        order: '',
        preview: false,
      })
      setSelectedSubcourseId('')
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Хичээл үүсгэхэд алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Хичээл нэмэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Шинэ хичээл нэмэх</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Subcourse Selection */}
          <div className="grid gap-2">
            <Label htmlFor="subcourse">Дэд хичээл сонгох</Label>
            <Select value={selectedSubcourseId} onValueChange={setSelectedSubcourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Дэд хичээл сонгох" />
              </SelectTrigger>
              <SelectContent>
                {subcourses.map((subcourse) => (
                  <SelectItem key={subcourse._id} value={subcourse._id}>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{subcourse.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {subcourse.order}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subcourses.length === 0 && (
              <p className="text-sm text-amber-600">
                Энэ хичээлд дэд хичээл байхгүй байна. Эхлээд дэд хичээл нэмнэ үү.
              </p>
            )}
          </div>

          {/* Lesson Details */}
          <div className="grid gap-2">
            <Label htmlFor="title">Гарчиг</Label>
            <Input 
              id="title" 
              placeholder="Хичээлийн гарчиг" 
              value={newLesson.title} 
              onChange={e => setNewLesson(v => ({ ...v, title: e.target.value }))} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Тайлбар</Label>
            <Textarea 
              id="description" 
              placeholder="Хичээлийн тайлбар" 
              value={newLesson.description} 
              onChange={e => setNewLesson(v => ({ ...v, description: e.target.value }))} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Үргэлжлэх хугацаа (мин)</Label>
              <Input 
                id="duration" 
                type="number" 
                placeholder="30" 
                value={newLesson.duration} 
                onChange={e => setNewLesson(v => ({ ...v, duration: e.target.value }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Дараалал</Label>
              <Input 
                id="order" 
                type="number" 
                placeholder="0" 
                value={newLesson.order} 
                onChange={e => setNewLesson(v => ({ ...v, order: e.target.value }))} 
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="videoUrl">Видео URL</Label>
            <Input 
              id="videoUrl" 
              placeholder="https://..." 
              value={newLesson.videoUrl} 
              onChange={e => setNewLesson(v => ({ ...v, videoUrl: e.target.value }))} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="preview">Урьдчилан харах</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="preview" 
                checked={newLesson.preview} 
                onCheckedChange={val => setNewLesson(v => ({ ...v, preview: val }))} 
              />
              <span>{newLesson.preview ? 'Тийм' : 'Үгүй'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowDialog(false)}>Цуцлах</Button>
          <Button 
            onClick={handleCreateLesson} 
            disabled={loading || !selectedSubcourseId || subcourses.length === 0}
          >
            {loading ? 'Хадгалж байна...' : 'Хадгалах'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
