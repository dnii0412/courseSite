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
import { Plus, Edit, Trash2, Search, Eye, BookOpen } from 'lucide-react'
import { AdminCourseDetailsInline } from '@/components/admin/course-details-inline'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface Course {
  _id?: string
  id?: number
  title: string
  description: string
  instructor: string | { name: string }
  price: number
  status?: 'active' | 'draft' | 'archived' | string
  category: string
  lessons?: number | any[]
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
      setCourses(data)
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
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Хичээл хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүгд</SelectItem>
              <SelectItem value="active">Идэвхтэй</SelectItem>
              <SelectItem value="draft">Ноорог</SelectItem>
              <SelectItem value="archived">Архивласан</SelectItem>
            </SelectContent>
          </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="instructor">Багш (нэр)</Label>
                  <Input id="instructor" placeholder="Багшийн нэр" value={newCourse.instructor} onChange={e => setNewCourse(v => ({ ...v, instructor: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Үнэ</Label>
                  <Input id="price" type="number" placeholder="₮" value={newCourse.price} onChange={e => setNewCourse(v => ({ ...v, price: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Ангилал</Label>
                  <Select value={newCourse.category} onValueChange={val => setNewCourse(v => ({ ...v, category: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ангилал сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="published">Нийтлэх</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="published" checked={newCourse.published} onCheckedChange={val => setNewCourse(v => ({ ...v, published: val }))} />
                    <span>{newCourse.published ? 'Тийм' : 'Үгүй'}</span>
                  </div>
                </div>
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
              {/* Lessons section */}
              {/* Lessons section removed from edit dialog; managed inline under each course */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-instructor">Багш (нэр)</Label>
                  <Input 
                    id="edit-instructor" 
                    value={typeof selectedCourse.instructor === 'string' ? selectedCourse.instructor : selectedCourse.instructor?.name || ''} 
                    onChange={e => setSelectedCourse({ ...selectedCourse, instructor: e.target.value })} 
                  />
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Ангилал</Label>
                  <Select 
                    value={selectedCourse.category} 
                    onValueChange={val => setSelectedCourse({ ...selectedCourse, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ангилал сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-published">Нийтлэх</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-published" 
                      checked={selectedCourse.published} 
                      onCheckedChange={val => setSelectedCourse({ ...selectedCourse, published: val })} 
                    />
                    <span>{selectedCourse.published ? 'Тийм' : 'Үгүй'}</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Үргэлжлэх хугацаа (цаг)</Label>
                <Input 
                  id="edit-duration" 
                  type="number" 
                  value={selectedCourse.duration || ''} 
                  onChange={e => setSelectedCourse({ ...selectedCourse, duration: Number(e.target.value) })} 
                />
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
        <CardHeader>
          <CardTitle>Хичээлүүд ({filteredCourses.length})</CardTitle>
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
                <div key={cid} className="p-4 border rounded-lg">
                  <div 
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setExpandedIds(prev => ({ ...prev, [cid]: !prev[cid] }))}
                    role="button"
                    aria-expanded={expanded}
                  >
                    <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                      <div className="flex-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Багш: {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Array.isArray(course.lessons) ? course.lessons.length : course.lessons || 0} хичээл
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {course.studentsCount || course.students || 0} сурагч
                        </span>
                      </div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
                      <div className="text-right">
                        <p className="font-medium">₮{course.price?.toLocaleString?.() ?? course.price}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.category}
                        </p>
                      </div>
                      {course.status && (
                        <Badge className={`bg-${course.status === 'active' ? 'green' : course.status === 'draft' ? 'yellow' : 'gray'}-100 text-${course.status === 'active' ? 'green' : course.status === 'draft' ? 'yellow' : 'gray'}-800`}>
                          {course.status === 'active' ? 'Идэвхтэй' : course.status === 'draft' ? 'Ноорог' : 'Архивласан'}
                        </Badge>
                      )}
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Inline details */}
                  {expanded && (
                    <AdminCourseDetailsInline courseId={cid} onChanged={fetchCourses} />
                  )}
                </div>
              )})}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
