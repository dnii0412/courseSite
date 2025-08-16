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
import { Plus, Edit, Trash2, Search, Eye, BookOpen, ChevronDown } from 'lucide-react'
import { SubcourseManagement } from '@/components/admin/subcourse-management'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface Course {
  _id?: string
  id?: number
  title: string
  description: string
  instructor: string | { name: string }
  price: number
  status?: 'active' | 'draft' | 'archived' | string
  category: string
  level?: string
  language?: string
  subcourses?: any[]
  students?: number
  studentsCount?: number
  createdAt?: string
  published?: boolean
  duration?: number
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showDialog, setShowDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    category: '',
    level: 'beginner',
    language: 'mongolian',
    status: 'active',
    published: true,
    duration: '',
  })
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  async function fetchCourses() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/courses?all=true')
      if (!res.ok) throw new Error('Алдаа гарлаа')
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data?.data ?? [])
      setCourses(list as any)
    } catch (err: any) {
      setError(err.message || 'Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof course.instructor === 'string' ? course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) : (course.instructor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Add course creation handler
  async function handleCreateCourse() {
    setCreating(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourse,
          price: Number(newCourse.price),
          published: newCourse.published,
          status: newCourse.status,
          duration: Number(newCourse.duration) || 1,
          instructor: newCourse.instructor, // Save as string
        }),
      })
      if (!res.ok) throw new Error('Хичээл үүсгэхэд алдаа гарлаа')
      setShowDialog(false)
      setNewCourse({
        title: '',
        description: '',
        instructor: '',
        price: '',
        category: '',
        level: 'beginner',
        language: 'mongolian',
        status: 'active',
        published: true,
        duration: '',
      })
      fetchCourses()
    } catch (err: any) {
      alert(err.message || 'Хичээл үүсгэхэд алдаа гарлаа')
    } finally {
      setCreating(false)
    }
  }

  // Edit course handler
  async function handleEditCourse() {
    if (!selectedCourse?._id) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedCourse,
          price: Number(selectedCourse.price),
          duration: Number(selectedCourse.duration) || 1,
        }),
      })
      if (!res.ok) throw new Error('Хичээл засахэд алдаа гарлаа')
      setShowEditDialog(false)
      setSelectedCourse(null)
      fetchCourses()
    } catch (err: any) {
      alert(err.message || 'Хичээл засахэд алдаа гарлаа')
    } finally {
      setUpdating(false)
    }
  }

  // Delete course handler
  async function handleDeleteCourse() {
    if (!selectedCourse?._id) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Хичээл устгахад алдаа гарлаа')
      setShowDeleteDialog(false)
      setSelectedCourse(null)
      fetchCourses()
    } catch (err: any) {
      alert(err.message || 'Хичээл устгахад алдаа гарлаа')
    } finally {
      setDeleting(false)
    }
  }

  // Toggle course visibility
  async function handleToggleVisibility(course: Course) {
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...course,
          published: !course.published,
        }),
      })
      if (!res.ok) throw new Error('Хичээл засахэд алдаа гарлаа')
      fetchCourses()
    } catch (err: any) {
      alert(err.message || 'Хичээл засахэд алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls moved inside the list card header below */}

      {/* Edit Course Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Хичээл засах</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Гарчиг</Label>
                <Input 
                  id="edit-title" 
                  value={selectedCourse.title} 
                  onChange={e => setSelectedCourse({ ...selectedCourse, title: e.target.value })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Тайлбар</Label>
                <Textarea 
                  id="edit-description" 
                  value={selectedCourse.description} 
                  onChange={e => setSelectedCourse({ ...selectedCourse, description: e.target.value })} 
                />
              </div>
              {/* Subcourses section */}
              <div className="grid gap-2">
                <Label>Дэд хичээлүүд</Label>
                <SubcourseManagement courseId={selectedCourse._id || ''} onChanged={() => fetchCourses()} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Үнэ</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    value={selectedCourse.price} 
                    onChange={e => setSelectedCourse({ ...selectedCourse, price: Number(e.target.value) })} 
                  />
                </div>
              </div>
              
              
              
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Цуцлах</Button>
            <Button onClick={handleEditCourse} disabled={updating}>{updating ? 'Хадгалж байна...' : 'Хадгалах'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хичээл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Та "{selectedCourse?.title}" хичээлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} disabled={deleting}>
              {deleting ? 'Устгаж байна...' : 'Устгах'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Courses List */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-ink-900 text-lg md:text-xl font-semibold">Хичээлүүд ({filteredCourses.length})</CardTitle>
          <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Хичээл хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-72 md:w-80"
              />
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Шинэ хичээл
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Шинэ хичээл нэмэх</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Гарчиг</Label>
                      <Input id="title" placeholder="Хичээлийн гарчиг" value={newCourse.title} onChange={e => setNewCourse(v => ({ ...v, title: e.target.value }))} />
                    </div>
                 
                  <div className="grid gap-2">
                    <Label htmlFor="description">Тайлбар</Label>
                    <Textarea id="description" placeholder="Хичээлийн тайлбар" value={newCourse.description} onChange={e => setNewCourse(v => ({ ...v, description: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Үнэ</Label>
                    <Input id="price" type="number" placeholder="Хичээлийн үнэ" value={newCourse.price} onChange={e => setNewCourse(v => ({ ...v, price: e.target.value }))} />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Үргэлжлэх хугацаа (цаг)</Label>
                    <Input id="duration" type="number" placeholder="1" value={newCourse.duration} onChange={e => setNewCourse(v => ({ ...v, duration: e.target.value }))} />
                  </div>
                  
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Цуцлах</Button>
                  <Button onClick={handleCreateCourse} disabled={creating}>{creating ? 'Хадгалж байна...' : 'Хадгалах'}</Button>
                </div>
              </DialogContent>
            </Dialog>
            
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Уншиж байна...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => {
                const cid = String(course._id || course.id)
                const expanded = !!expandedIds[cid]
                return (
                <Collapsible key={cid} open={expanded} onOpenChange={(open) => setExpandedIds(prev => ({ ...prev, [cid]: open }))}>
                  <div className="p-4 border border-gray-200 rounded-2xl">
                    <CollapsibleTrigger asChild>
                      <div
                        className="flex items-center justify-between cursor-pointer select-none"
                        role="button"
                        aria-expanded={expanded}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-black truncate">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-500">Үнэ: ${course.price}</span>
                              <span className="text-sm text-gray-500">Дэд хичээл: {Array.isArray(course.subcourses) ? course.subcourses.length : 0}</span>
                              <span className="text-sm text-gray-500">Сурагчид: {course.studentsCount || 0}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
                          <span className="text-lg font-bold text-black">${course.price}</span>
                          <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {course.status === 'active' ? 'Идэвхтэй' : course.status === 'draft' ? 'Ноорог' : 'Идэвхгүй'}
                          </Badge>
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        
                        {/* Subcourses Section */}
                        <div className=" pt-4 ">
                          
                          <SubcourseManagement courseId={cid} onChanged={fetchCourses} />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )})}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
