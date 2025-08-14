"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Phone,
  Lock,
  BookOpen,
  CreditCard,
  Edit3,
  Save,
  X,
  Calendar,
  Clock,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  createdAt: string
  image?: string
}

interface Course {
  _id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  level: string
  duration: number
  lessons: number
  rating: number
  enrolledAt: string
  progress: number
}

interface Payment {
  _id: string
  amount: number
  currency: string
  status: string
  courseId: string
  courseTitle: string
  paymentMethod: string
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    fetchProfileData()
  }, [session, status, router])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)

      // Fetch user profile
      const profileRes = await fetch(`/api/users/${session?.user?.id}`)
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
        setEditForm({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }

      // Fetch enrolled courses
      const coursesRes = await fetch('/api/users/enrollments')
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        setCourses(coursesData)
      }

      // Fetch payment history
      const paymentsRes = await fetch('/api/users/payments')
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Профайл мэдээлэл ачаалж чадсангүй')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      toast.error('Шинэ нууц үг таарахгүй байна')
      return
    }

    try {
      setIsUpdating(true)

      const updateData: any = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      }

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword
        updateData.newPassword = editForm.newPassword
      }

      const res = await fetch(`/api/users/${profile?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (res.ok) {
        const updatedProfile = await res.json()
        setProfile(updatedProfile)
        setIsEditing(false)
        toast.success('Профайл амжилттай шинэчлэгдлээ')

        // Reset password fields
        setEditForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        const error = await res.json()
        toast.error(error.message || 'Профайл шинэчлэхэд алдаа гарлаа')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Профайл шинэчлэхэд алдаа гарлаа')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="h-64 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Профайл</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.image || session.user.image || ''} />
                    <AvatarFallback className="text-2xl bg-gray-600 text-white">
                      {profile?.name?.charAt(0) || session.user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{profile?.name || session.user.name}</CardTitle>
                <CardDescription>{profile?.email || session.user.email}</CardDescription>
                {profile?.role && (
                  <Badge variant="secondary" className="mt-2">
                    {profile.role === 'ADMIN' ? 'Админ' : 'Хэрэглэгч'}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Бүртгүүлсэн: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('mn-MN') : 'Тодорхойгүй'}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Хувийн мэдээлэл</TabsTrigger>
                <TabsTrigger value="courses">Миний хичээлүүд</TabsTrigger>
                <TabsTrigger value="payments">Төлбөр</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Хувийн мэдээлэл</CardTitle>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Засах
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile} size="sm" disabled={isUpdating}>
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdating ? 'Хадгалж байна...' : 'Хадгалах'}
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            <X className="w-4 h-4 mr-2" />
                            Цуцлах
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Нэр</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Таны нэр"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Имэйл</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Таны имэйл"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Утасны дугаар</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Утасны дугаар"
                        />
                      </div>

                      {isEditing && (
                        <div className="space-y-4 pt-4 border-t">
                          {/* Only show password change form for users who have a password (not OAuth users) */}
                          {!(session?.user as any)?.oauthProvider && (
                            <>
                              <h4 className="font-medium text-gray-900">Нууц үг солих</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="currentPassword">Одоогийн нууц үг</Label>
                                  <Input
                                    id="currentPassword"
                                    type="password"
                                    value={editForm.currentPassword}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Одоогийн нууц үг"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="newPassword">Шинэ нууц үг</Label>
                                  <Input
                                    id="newPassword"
                                    type="password"
                                    value={editForm.newPassword}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Шинэ нууц үг"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
                                  <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={editForm.confirmPassword}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Нууц үг давтах"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {/* Show OAuth info for OAuth users */}
                          {(session?.user as any)?.oauthProvider && (
                            <div className="space-y-4 pt-4 border-t">
                              <h4 className="font-medium text-gray-900">Нэвтрэх мэдээлэл</h4>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-blue-800">
                                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {(session.user as any).oauthProvider === 'google' ? 'G' : 'F'}
                                    </span>
                                  </div>
                                  <span className="font-medium">
                                    {(session.user as any).oauthProvider === 'google' ? 'Google' : 'Facebook'} ашиглан нэвтэрсэн
                                  </span>
                                </div>
                                <p className="text-blue-700 text-sm mt-2">
                                  Та {(session.user as any).oauthProvider === 'google' ? 'Google' : 'Facebook'} ашиглан нэвтэрсэн тул нууц үг солих боломжгүй.
                                  Нэвтрэхийн тулд {(session.user as any).oauthProvider === 'google' ? 'Google' : 'Facebook'} ашиглана уу.
                                </p>
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Миний хичээлүүд ({courses.length})</CardTitle>
                    <CardDescription>Таны бүртгүүлсэн бүх хичээлүүд</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {courses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Та одоогоор ямар нэг хичээлд бүртгүүлээгүй байна</p>
                        <Button asChild className="mt-4">
                          <a href="/courses">Хичээл харах</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {courses.map((course) => (
                          <div key={course._id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              {course.image ? (
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <BookOpen className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{course.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {course.duration}ц
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {course.lessons} хичээл
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  {course.rating.toFixed(1)}
                                </span>
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {course.progress}% дууссан
                                </p>
                              </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <a href={`/learn/${course._id}`}>Үргэлжлүүлэх</a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Төлбөрийн түүх ({payments.length})</CardTitle>
                    <CardDescription>Таны хийсэн бүх төлбөрүүд</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Та одоогоор ямар нэг төлбөр төлөөгүй байна</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments.map((payment) => (
                          <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{payment.courseTitle}</h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(payment.createdAt).toLocaleDateString('mn-MN')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {payment.amount.toLocaleString()} {payment.currency}
                              </p>
                              <Badge
                                variant={payment.status === 'completed' ? 'default' : 'secondary'}
                                className="mt-1"
                              >
                                {payment.status === 'completed' ? 'Амжилттай' : 'Хүлээгдэж байна'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
