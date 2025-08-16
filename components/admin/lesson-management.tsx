'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Play, ChevronDown, Eye } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface Lesson {
  _id?: string
  title: string
  description: string
  videoUrl?: string
  videoId?: string
  videoStatus: 'pending' | 'uploading' | 'uploaded' | 'failed'
  videoFile?: string
  duration: number
  order: number
  preview: boolean
  quiz?: {
    questions: Array<{
      question: string
      options: string[]
      correctAnswer: number
    }>
  }
  createdAt?: string
}

interface LessonManagementProps {
  subcourseId: string
  onChanged: () => void
}

export function LessonManagement({ subcourseId, onChanged }: LessonManagementProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoId: '',
    duration: '',
    order: '',
    preview: false,
  })
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  async function fetchLessons() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/lessons?subcourseId=${subcourseId}`)
      if (!res.ok) throw new Error('Алдаа гарлаа')
      const data = await res.json()
      setLessons(data)
    } catch (err: any) {
      setError(err.message || 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [subcourseId])

  async function handleCreateLesson() {
    setCreating(true)
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLesson,
          subcourseId,
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
      fetchLessons()
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Хичээл үүсгэхэд алдаа гарлаа')
    } finally {
      setCreating(false)
    }
  }

  async function handleEditLesson() {
    if (!selectedLesson?._id) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/lessons/${selectedLesson._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedLesson,
          duration: Number(selectedLesson.duration),
          order: Number(selectedLesson.order) || 0,
        }),
      })
      if (!res.ok) throw new Error('Хичээл засахэд алдаа гарлаа')
      setShowEditDialog(false)
      setSelectedLesson(null)
      fetchLessons()
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Хичээл засахэд алдаа гарлаа')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDeleteLesson() {
    if (!selectedLesson?._id) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/lessons/${selectedLesson._id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Хичээл устгахад алдаа гарлаа')
      setShowDeleteDialog(false)
      setSelectedLesson(null)
      fetchLessons()
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Хичээл устгахад алдаа гарлаа')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Create Lesson Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Шинэ хичээл нэмэх</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <Button onClick={handleCreateLesson} disabled={creating}>
              {creating ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Хичээл засах</DialogTitle>
          </DialogHeader>
          {selectedLesson && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Гарчиг</Label>
                <Input 
                  id="edit-title" 
                  value={selectedLesson.title} 
                  onChange={e => setSelectedLesson({ ...selectedLesson, title: e.target.value })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Тайлбар</Label>
                <Textarea 
                  id="edit-description" 
                  value={selectedLesson.description} 
                  onChange={e => setSelectedLesson({ ...selectedLesson, description: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration">Үргэлжлэх хугацаа (мин)</Label>
                  <Input 
                    id="edit-duration" 
                    type="number" 
                    value={selectedLesson.duration} 
                    onChange={e => setSelectedLesson({ ...selectedLesson, duration: Number(e.target.value) })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-order">Дараалал</Label>
                  <Input 
                    id="edit-order" 
                    type="number" 
                    value={selectedLesson.order} 
                    onChange={e => setSelectedLesson({ ...selectedLesson, order: Number(e.target.value) })} 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-videoUrl">Видео URL</Label>
                <Input 
                  id="edit-videoUrl" 
                  value={selectedLesson.videoUrl || ''} 
                  onChange={e => setSelectedLesson({ ...selectedLesson, videoUrl: e.target.value })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-preview">Урьдчилан харах</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-preview" 
                    checked={selectedLesson.preview} 
                    onCheckedChange={val => setSelectedLesson({ ...selectedLesson, preview: val })} 
                  />
                  <span>{selectedLesson.preview ? 'Тийм' : 'Үгүй'}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Цуцлах</Button>
            <Button onClick={handleEditLesson} disabled={updating}>
              {updating ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хичээл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та "{selectedLesson?.title}" хичээлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} disabled={deleting}>
              {deleting ? 'Устгаж байна...' : 'Устгах'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lessons List */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium">Хичээлүүд ({lessons.length})</h4>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Хичээл нэмэх
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-2">Уншиж байна...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-2">{error}</div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const lid = String(lesson._id)
            const expanded = !!expandedIds[lid]
            return (
              <Collapsible key={lid} open={expanded} onOpenChange={(open) => setExpandedIds(prev => ({ ...prev, [lid]: open }))}>
                <div className="p-2 border border-gray-200 rounded-md">
                  <CollapsibleTrigger asChild>
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      role="button"
                      aria-expanded={expanded}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                          <Play className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-black truncate">{lesson.title}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{lesson.duration}мин</span>
                            <span className="text-xs text-gray-500">Дараалал: {lesson.order}</span>
                            {lesson.preview && (
                              <Badge variant="outline" className="text-xs">Урьдчилан харах</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">{lesson.description}</p>
                      {lesson.videoUrl && (
                        <div className="text-xs text-gray-500">
                          Видео: {lesson.videoUrl}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>
      )}
    </div>
  )
}
