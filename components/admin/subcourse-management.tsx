'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, BookOpen, ChevronDown, Eye, Play, Video } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { LessonCreationDialog } from '@/components/admin/lesson-creation-dialog'

interface Subcourse {
  _id?: string
  title: string
  description: string
  duration: number
  order: number
  published: boolean
  status: 'active' | 'inactive' | 'draft'
  lessons?: any[]
  createdAt?: string
}

interface SubcourseManagementProps {
  courseId: string
  onChanged: () => void
}

export function SubcourseManagement({ courseId, onChanged }: SubcourseManagementProps) {
  const [subcourses, setSubcourses] = useState<Subcourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSubcourse, setSelectedSubcourse] = useState<Subcourse | null>(null)
  const [newSubcourse, setNewSubcourse] = useState({
    title: '',
    description: '',
    duration: '',
    order: '',
    status: 'active',
    published: true,
  })
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [showLessonDialog, setShowLessonDialog] = useState(false)
  const [selectedSubcourseForLesson, setSelectedSubcourseForLesson] = useState<string>('')
  const [showEditLessonDialog, setShowEditLessonDialog] = useState(false)
  const [showDeleteLessonDialog, setShowDeleteLessonDialog] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [editingLesson, setEditingLesson] = useState({
    title: '',
    description: '',
    duration: '',
    order: '',
    preview: false,
  })

  async function fetchSubcourses() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/subcourses?courseId=${courseId}`)
      if (!res.ok) throw new Error('Алдаа гарлаа')
      const data = await res.json()
      console.log('Fetched subcourses:', data) // Debug log
      setSubcourses(data)
    } catch (err: any) {
      setError(err.message || 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubcourses()
  }, [courseId])

  async function handleCreateSubcourse() {
    setCreating(true)
    try {
      const res = await fetch('/api/subcourses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSubcourse,
          courseId,
          duration: Number(newSubcourse.duration),
          order: Number(newSubcourse.order) || 0,
        }),
      })
      if (!res.ok) throw new Error('Дэд хичээл үүсгэхэд алдаа гарлаа')
      setShowDialog(false)
      setNewSubcourse({
        title: '',
        description: '',
        duration: '',
        order: '',
        status: 'active',
        published: true,
      })
      fetchSubcourses()
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Дэд хичээл үүсгэхэд алдаа гарлаа')
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdateSubcourse() {
    if (!selectedSubcourse) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/subcourses/${selectedSubcourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSubcourse),
      })
      if (!res.ok) throw new Error('Дэд хичээл шинэчлэхэд алдаа гарлаа')
      setShowEditDialog(false)
      setSelectedSubcourse(null)
      fetchSubcourses()
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Дэд хичээл шинэчлэхэд алдаа гарлаа')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDeleteSubcourse() {
    if (!selectedSubcourse) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/subcourses/${selectedSubcourse._id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Дэд хичээл устгахад алдаа гарлаа')
      setShowDeleteDialog(false)
      setSelectedSubcourse(null)
      fetchSubcourses()
      onChanged()
    } catch (err: any) {
      alert(err.message || 'Дэд хичээл устгахад алдаа гарлаа')
    } finally {
      setDeleting(false)
    }
  }

  const handleLessonCreated = () => {
    fetchSubcourses()
    onChanged()
  }

  const handleEditLesson = (lesson: any) => {
    console.log('📝 Editing lesson - Full lesson data:', lesson)
    console.log('📝 Lesson description:', lesson.description)
    console.log('📝 Lesson title:', lesson.title)
    
    setSelectedLesson(lesson)
    setEditingLesson({
      title: lesson.title || '',
      description: lesson.description || '',
      duration: lesson.duration?.toString() || '',
      order: lesson.order?.toString() || '',
      preview: lesson.preview || false,
    })
    
    console.log('📝 Set editing lesson data:', {
      title: lesson.title || '',
      description: lesson.description || '',
      duration: lesson.duration?.toString() || '',
      order: lesson.order?.toString() || '',
      preview: lesson.preview || false,
    })
    
    setShowEditLessonDialog(true)
  }

  const handleUpdateLesson = async () => {
    if (!selectedLesson?._id) return
    
    try {
      console.log('🔄 Updating lesson with data:', editingLesson)
      
      const res = await fetch(`/api/lessons/${selectedLesson._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingLesson,
          duration: Number(editingLesson.duration),
          order: Number(editingLesson.order) || 0,
        }),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Хичээл шинэчлэхэд алдаа гарлаа')
      }

      const result = await res.json()
      console.log('✅ Lesson update response:', result)

      setShowEditLessonDialog(false)
      setSelectedLesson(null)
      fetchSubcourses()
      onChanged()
    } catch (err: any) {
      console.error('❌ Error updating lesson:', err)
      alert(err.message || 'Хичээл шинэчлэхэд алдаа гарлаа')
    }
  }

  const handleDeleteLesson = async () => {
    if (!selectedLesson?._id) return
    
    try {
      console.log('🗑️ Deleting lesson:', selectedLesson._id, selectedLesson.title)
      
      const res = await fetch(`/api/lessons/${selectedLesson._id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Хичээл устгахад алдаа гарлаа')
      }

      const result = await res.json()
      console.log('✅ Lesson deletion response:', result)

      setShowDeleteLessonDialog(false)
      setSelectedLesson(null)
      fetchSubcourses()
      onChanged()
    } catch (err: any) {
      console.error('❌ Error deleting lesson:', err)
      alert(err.message || 'Хичээл устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-4">
      {/* Create Subcourse Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Шинэ дэд хичээл нэмэх</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Гарчиг</Label>
              <Input 
                id="title" 
                placeholder="Дэд хичээлийн гарчиг" 
                value={newSubcourse.title} 
                onChange={e => setNewSubcourse(v => ({ ...v, title: e.target.value }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Тайлбар</Label>
              <Textarea 
                id="description" 
                placeholder="Дэд хичээлийн тайлбар" 
                value={newSubcourse.description} 
                onChange={e => setNewSubcourse(v => ({ ...v, description: e.target.value }))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Үргэлжлэх хугацаа (цаг)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  placeholder="1" 
                  value={newSubcourse.duration} 
                  onChange={e => setNewSubcourse(v => ({ ...v, duration: e.target.value }))} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Дараалал</Label>
                <Input 
                  id="order" 
                  type="number" 
                  placeholder="0" 
                  value={newSubcourse.order} 
                  onChange={e => setNewSubcourse(v => ({ ...v, order: e.target.value }))} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Төлөв</Label>
                <Select value={newSubcourse.status} onValueChange={val => setNewSubcourse(v => ({ ...v, status: val as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Төлөв сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Идэвхтэй</SelectItem>
                    <SelectItem value="draft">Ноорог</SelectItem>
                    <SelectItem value="inactive">Идэвхгүй</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="published">Нийтлэх</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="published" 
                    checked={newSubcourse.published} 
                    onCheckedChange={val => setNewSubcourse(v => ({ ...v, published: val }))} 
                  />
                  <span>{newSubcourse.published ? 'Тийм' : 'Үгүй'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Цуцлах</Button>
            <Button onClick={handleCreateSubcourse} disabled={creating}>
              {creating ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subcourse Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Дэд хичээл засах</DialogTitle>
          </DialogHeader>
          {selectedSubcourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Гарчиг</Label>
                <Input 
                  id="edit-title" 
                  value={selectedSubcourse.title} 
                  onChange={e => setSelectedSubcourse({ ...selectedSubcourse, title: e.target.value })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Тайлбар</Label>
                <Textarea 
                  id="edit-description" 
                  value={selectedSubcourse.description} 
                  onChange={e => setSelectedSubcourse({ ...selectedSubcourse, description: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration">Үргэлжлэх хугацаа (цаг)</Label>
                  <Input 
                    id="edit-duration" 
                    type="number" 
                    value={selectedSubcourse.duration} 
                    onChange={e => setSelectedSubcourse({ ...selectedSubcourse, duration: Number(e.target.value) })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-order">Дараалал</Label>
                  <Input 
                    id="edit-order" 
                    type="number" 
                    value={selectedSubcourse.order} 
                    onChange={e => setSelectedSubcourse({ ...selectedSubcourse, order: Number(e.target.value) })} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Төлөв</Label>
                  <Select 
                    value={selectedSubcourse.status} 
                    onValueChange={val => setSelectedSubcourse({ ...selectedSubcourse, status: val as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Идэвхтэй</SelectItem>
                      <SelectItem value="draft">Ноорог</SelectItem>
                      <SelectItem value="inactive">Идэвхгүй</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-published">Нийтлэх</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-published" 
                      checked={selectedSubcourse.published} 
                      onCheckedChange={val => setSelectedSubcourse({ ...selectedSubcourse, published: val })} 
                    />
                    <span>{selectedSubcourse.published ? 'Тийм' : 'Үгүй'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Цуцлах</Button>
            <Button onClick={handleUpdateSubcourse} disabled={updating}>
              {updating ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Subcourse Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Дэд хичээл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedSubcourse?.title}" дэд хичээлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubcourse} disabled={deleting}>
              {deleting ? 'Устгаж байна...' : 'Устгах'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lesson Creation Dialog */}
      <LessonCreationDialog
        open={showLessonDialog}
        onOpenChange={setShowLessonDialog}
        subcourseId={selectedSubcourseForLesson}
        onLessonCreated={handleLessonCreated}
      />

      {/* Edit Lesson Dialog */}
      <Dialog open={showEditLessonDialog} onOpenChange={setShowEditLessonDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Хичээл засах</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson-title">Гарчиг</Label>
              <Input 
                id="edit-lesson-title" 
                placeholder="Хичээлийн гарчиг" 
                value={editingLesson.title} 
                onChange={e => setEditingLesson(v => ({ ...v, title: e.target.value }))} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson-description">Тайлбар</Label>
              <Textarea 
                id="edit-lesson-description" 
                placeholder="Хичээлийн тайлбар" 
                value={editingLesson.description} 
                onChange={e => setEditingLesson(v => ({ ...v, description: e.target.value }))} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-lesson-duration">Үргэлжлэх хугацаа (мин)</Label>
                <Input 
                  id="edit-lesson-duration" 
                  type="number" 
                  placeholder="30" 
                  value={editingLesson.duration} 
                  onChange={e => setEditingLesson(v => ({ ...v, duration: e.target.value }))} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-lesson-order">Дараалал</Label>
                <Input 
                  id="edit-lesson-order" 
                  type="number" 
                  placeholder="0" 
                  value={editingLesson.order} 
                  onChange={e => setEditingLesson(v => ({ ...v, order: e.target.value }))} 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson-preview">Урьдчилан харах</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-lesson-preview" 
                  checked={editingLesson.preview} 
                  onCheckedChange={val => setEditingLesson(v => ({ ...v, preview: val }))} 
                />
                <span>{editingLesson.preview ? 'Тийм' : 'Үгүй'}</span>
              </div>
            </div>
            
           
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditLessonDialog(false)}>
              Цуцлах
            </Button>
            <Button onClick={handleUpdateLesson}>
              Хадгалах
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Lesson Dialog */}
      <AlertDialog open={showDeleteLessonDialog} onOpenChange={setShowDeleteLessonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хичээл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedLesson?.title}" хичээлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson}>
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Subcourses List */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Дэд хичээлүүд ({subcourses.length})</h3>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Дэд хичээл нэмэх
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4">Уншиж байна...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="space-y-3">
          {subcourses.map((subcourse) => {
            const sid = String(subcourse._id)
            const expanded = !!expandedIds[sid]
            return (
              <Collapsible key={sid} open={expanded} onOpenChange={(open) => setExpandedIds(prev => ({ ...prev, [sid]: open }))}>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      role="button"
                      aria-expanded={expanded}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-black truncate">{subcourse.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{subcourse.description}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-500">Хугацаа: {subcourse.duration}ц</span>
                            <span className="text-xs text-gray-500">Хичээл: {Array.isArray(subcourse.lessons) ? subcourse.lessons.length : 0}</span>
                            <span className="text-xs text-gray-500">Дараалал: {subcourse.order}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSubcourse(subcourse)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSubcourse(subcourse)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Хичээлүүд:</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSubcourseForLesson(subcourse._id || '')
                            setShowLessonDialog(true)
                          }}
                        >
                          <Video className="w-3 h-3 mr-1" />
                          Хичээл нэмэх
                        </Button>
                      </div>
                      {Array.isArray(subcourse.lessons) && subcourse.lessons.length > 0 ? (
                        <div className="space-y-2">
                          {subcourse.lessons.map((lesson: any, index: number) => {
                            console.log('Lesson data:', lesson) // Debug log
                            return (
                              <div key={lesson._id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">{index + 1}.</span>
                                  <span className="text-sm font-medium">
                                    {lesson.title || lesson.name || 'Untitled Lesson'}
                                  </span>
                                  {lesson.duration && (
                                    <Badge variant="outline" className="text-xs">
                                      {lesson.duration}мин
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditLesson(lesson)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedLesson(lesson)
                                      setShowDeleteLessonDialog(true)
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">Хичээл байхгүй</p>
                          <p className="text-xs mt-1">
                            {subcourse.lessons ? `Lessons data: ${JSON.stringify(subcourse.lessons)}` : 'No lessons array'}
                          </p>
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
