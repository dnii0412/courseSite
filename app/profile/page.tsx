"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/hooks/useAuth"
import { User, Mail, Phone, Edit, Save, X, Lock } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        newPassword: "",
        confirmPassword: ""
      })
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      if (!user?.id) return
      
      // Fetch user's profile data including stats
      const response = await fetch(`/api/auth/profile`)
      if (response.ok) {
        const profileData = await response.json()
        const { stats, user: userDetails } = profileData
        
        setUserStats({
          totalCourses: stats.totalCourses,
          completedCourses: stats.completedCourses
        })
        
        // Update form data with user details
        setFormData({
          name: userDetails.name || "",
          email: userDetails.email || "",
          phone: userDetails.phone || "",
          newPassword: "",
          confirmPassword: ""
        })
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsEditing(false)
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          newPassword: "",
          confirmPassword: ""
        }))
        // Refresh user stats
        fetchUserStats()
        // You could add a toast notification here
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        newPassword: "",
        confirmPassword: ""
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Нэвтрэх шаардлагатай</h1>
          <p className="text-gray-600 mb-6">Энэ хуудсыг үзэхийн тулд нэвтэрнэ үү.</p>
          <Link href="/login">
            <Button>Нэвтрэх</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Миний профайл</h1>
            <p className="text-gray-600">Профайлын мэдээллээ шинэчлэх</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {user.role === "admin" ? "Админ" : "Оюутан"}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userStats.totalCourses}</p>
                        <p className="text-sm text-gray-600">Хичээл</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userStats.completedCourses}</p>
                        <p className="text-sm text-gray-600">Дууссан хичээл</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Хувийн мэдээлэл</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Засах
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Хадгалах
                      </Button>
                      <Button variant="outline" onClick={handleCancel} size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Цуцлах
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Нэр</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{formData.name || "Тодорхойгүй"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Имэйл</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{formData.email || "Тодорхойгүй"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Утасны дугаар</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Утасны дугаар оруулна уу"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{formData.phone || "Тодорхойгүй"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Нууц үг солих</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Шинэ нууц үг</Label>
                        {isEditing ? (
                          <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder="Шинэ нууц үг оруулна уу"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">••••••••</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Нууц үг баталгаажуулах</Label>
                        {isEditing ? (
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Нууц үг давтаж оруулна уу"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">••••••••</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Account Section */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">Аккаунт устгах</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Энэ үйлдэл нь таны бүх мэдээллийг бүр мөсөн устгах болно. Энэ үйлдлийг буцааж болохгүй.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={async () => {
                        if (confirm('Та өөрийн аккаунтыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцааж болохгүй.')) {
                          try {
                            const response = await fetch('/api/auth/delete-account', {
                              method: 'DELETE',
                            })
                            
                            if (response.ok) {
                              // Redirect to home page after successful deletion
                              window.location.href = '/'
                            } else {
                              const error = await response.json()
                              alert(`Аккаунт устгахад алдаа гарлаа: ${error.error}`)
                            }
                          } catch (error) {
                            console.error('Error deleting account:', error)
                            alert('Аккаунт устгахад алдаа гарлаа')
                          }
                        }
                      }}
                    >
                      Аккаунт устгах
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
