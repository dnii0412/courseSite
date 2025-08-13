'use client'
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
import { FiltersBar } from '@/components/admin/filters-bar'

const getRoleBadge = (_role: string) => null

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
        const json = await res.json()
        const list = Array.isArray(json) ? json : (json?.data ?? [])
        setUsers(list)
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
          
        }),
      })
      if (!res.ok) throw new Error('Хэрэглэгч засахэд алдаа гарлаа')
      setShowEditDialog(false)
      setSelectedUser(null)
      // Refresh users list
      const res2 = await fetch('/api/users')
      if (res2.ok) {
        const json = await res2.json()
        const list = Array.isArray(json) ? json : (json?.data ?? [])
        setUsers(list)
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
        const json = await res2.json()
        const list = Array.isArray(json) ? json : (json?.data ?? [])
        setUsers(list)
      }
    } catch (err: any) {
      alert(err.message || 'Хэрэглэгч устгахад алдаа гарлаа')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
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
                  if (res.ok) {
                    const json = await res.json()
                    setUsers(Array.isArray(json) ? json : (json?.data ?? []))
                  }
                }
              }} />
            </DialogContent>
          </Dialog>

          <FiltersBar sticky>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-ink-500" />
              <Input placeholder="Хэрэглэгч хайх..." className="pl-8" />
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Шинэ хэрэглэгч
            </Button>
          </FiltersBar>

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

          <div className="mx-auto max-w-[1200px] px-4 md:px-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Хэрэглэгчид</CardTitle>
              </CardHeader>
              <CardContent>
              {loading ? (
                <div className="text-center py-8">Уншиж байна...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user._id} className="w-full p-4 border border-sand-200 rounded-2xl hover:bg-sand-50 transition-colors">
                        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar || '/placeholder-user.jpg'} alt={user.name} />
                            <AvatarFallback>
                              {user.name?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-none text-ink-900 truncate">{user.name}</p>
                            <p className="text-sm text-ink-500 truncate">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowEditDialog(true)
                              }}
                              aria-label="Засах"
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
                              aria-label="Устгах"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                          {user.status && <span>{getStatusBadge(user.status)}</span>}
                          {Array.isArray(user.enrolledCourses) && user.enrolledCourses.length > 0 && (
                            <span className="truncate">Курсууд: {user.enrolledCourses.map((c: any) => typeof c === 'string' ? c : c.title).join(', ')}</span>
                          )}
                          <span className="ml-auto text-ink-500">{user.createdAt ? formatDate(user.createdAt) : ''}</span>
                        </div>
                      </div>
                    ))}
                </div>
                )}
              </CardContent>
            </Card>
          </div>
    </div>
  )
}
