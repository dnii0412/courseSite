'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreateUserForm } from '@/components/admin/create-user-form'
import { AddCourseDropdown } from '@/components/admin/add-course-dropdown'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-red-100 text-red-800">Админ</Badge>
    case 'instructor':
      return <Badge className="bg-blue-100 text-blue-800">Багш</Badge>
    case 'student':
      return <Badge className="bg-green-100 text-green-800">Сурагч</Badge>
    default:
      return <Badge variant="secondary">{role}</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Идэвхтэй</Badge>
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800">Идэвхгүй</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('Алдаа гарлаа')
        const data = await res.json()
        setUsers(data)
      } catch (err: any) {
        setError(err.message || 'Алдаа гарлаа')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Edit user handler
  async function handleEditUser() {
    if (!selectedUser?._id) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
        }),
      })
      if (!res.ok) throw new Error('Хэрэглэгч засахэд алдаа гарлаа')
      setShowEditDialog(false)
      setSelectedUser(null)
      // Refresh users list
      const res2 = await fetch('/api/users')
      if (res2.ok) {
        const data = await res2.json()
        setUsers(data)
      }
    } catch (err: any) {
      alert(err.message || 'Хэрэглэгч засахэд алдаа гарлаа')
    } finally {
      setUpdating(false)
    }
  }

  // Delete user handler
  async function handleDeleteUser() {
    if (!selectedUser?._id) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Хэрэглэгч устгахад алдаа гарлаа')
      setShowDeleteDialog(false)
      setSelectedUser(null)
      // Refresh users list
      const res2 = await fetch('/api/users')
      if (res2.ok) {
        const data = await res2.json()
        setUsers(data)
      }
    } catch (err: any) {
      alert(err.message || 'Хэрэглэгч устгахад алдаа гарлаа')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          {/* Create User Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Шинэ хэрэглэгч нэмэх</DialogTitle>
              </DialogHeader>
              <CreateUserForm onClose={async (created) => {
                setShowCreateDialog(false)
                if (created) {
                  const res = await fetch('/api/users')
                  if (res.ok) setUsers(await res.json())
                }
              }} />
            </DialogContent>
          </Dialog>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Хэрэглэгчид
            </h1>
            <p className="text-gray-600">
              Системийн бүх хэрэглэгчдийн жагсаалт
            </p>
          </div>

          {/* Edit User Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Хэрэглэгч засах</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Нэр</Label>
                    <Input 
                      id="edit-name" 
                      value={selectedUser.name} 
                      onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">И-мэйл</Label>
                    <Input 
                      id="edit-email" 
                      type="email"
                      value={selectedUser.email} 
                      onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Эрх</Label>
                    <Select 
                      value={selectedUser.role} 
                      onValueChange={val => setSelectedUser({ ...selectedUser, role: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Сурагч</SelectItem>
                        <SelectItem value="instructor">Багш</SelectItem>
                        <SelectItem value="admin">Админ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Show user's courses */}
                  {Array.isArray(selectedUser.enrolledCourses) && selectedUser.enrolledCourses.length > 0 && (
                    <div className="grid gap-2">
                      <Label>Худалдан авсан курсууд</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.enrolledCourses.map((c: any) => (
                          <span key={typeof c === 'string' ? c : c._id} className="px-2 py-1 text-xs rounded bg-gray-100">
                            {typeof c === 'string' ? c : c.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Add course from dropdown */}
                  <AddCourseDropdown 
                    userId={selectedUser._id}
                    onAdded={async () => {
                      const res = await fetch(`/api/users/${selectedUser._id}`)
                      if (res.ok) setSelectedUser(await res.json())
                    }}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Цуцлах</Button>
                <Button onClick={handleEditUser} disabled={updating}>{updating ? 'Хадгалж байна...' : 'Хадгалах'}</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Хэрэглэгч устгах</AlertDialogTitle>
                <AlertDialogDescription>
                  Та "{selectedUser?.name}" хэрэглэгчийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} disabled={deleting}>
                  {deleting ? 'Устгаж байна...' : 'Устгах'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Хэрэглэгчид</CardTitle>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Шинэ хэрэглэгч
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Хэрэглэгч хайх..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Уншиж байна...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || '/placeholder-user.jpg'} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      
                  <div className="flex items-center space-x-2">
                        {getRoleBadge(user.role)}
                        {user.status && getStatusBadge(user.status)}
                      </div>
                  {Array.isArray(user.enrolledCourses) && user.enrolledCourses.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Курсууд: {user.enrolledCourses.map((c: any) => typeof c === 'string' ? c : c.title).join(', ')}
                    </div>
                  )}
                      
                      <div className="text-sm text-muted-foreground">
                        {user.createdAt ? formatDate(user.createdAt) : ''}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
