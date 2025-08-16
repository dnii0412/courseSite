"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Debug logging
  console.log('AdminLoginPage rendered - Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR')

  // No need for aggressive redirect monitoring with custom auth

  // Check if user already has admin session
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        // Since the cookie is httpOnly, we need to call the verification API directly
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const next = searchParams.get('next') || '/admin'
          console.log('Admin login page - Redirecting existing admin to:', next)
          router.push(next)
        }
      } catch (error) {
        console.error('Error checking admin session:', error)
      }
    }

    checkAdminSession()
  }, [router, searchParams])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Attempting login with:', email)
      
      // Use custom admin login API to bypass NextAuth redirects
      const loginResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Admin login response:', loginResponse)

      if (loginResponse.ok) {
        const result = await loginResponse.json()
        console.log('Admin login result:', result)
        
        if (result.success) {
          toast({
            title: "Амжилттай",
            description: "Админ хэсэгт нэвтэрлээ",
          })
          
          // Force redirect to admin panel using window.location
          const next = searchParams.get('next') || '/admin'
          console.log('Redirecting to admin panel:', next)
          
          // Use window.location directly to avoid any redirect issues
          setTimeout(() => {
            window.location.href = next
          }, 500)
          
        } else {
          toast({
            title: "Алдаа",
            description: "Нэвтрэхэд алдаа гарлаа",
            variant: "destructive",
          })
        }
      } else {
        const errorData = await loginResponse.json()
        console.error('Admin login error:', errorData)
        
        let errorMessage = "Имэйл эсвэл нууц үг буруу байна"
        
        if (errorData.error === 'Admin access required') {
          errorMessage = "Та админ эрхгүй байна"
        } else if (errorData.error === 'Invalid credentials') {
          errorMessage = "Имэйл эсвэл нууц үг буруу байна"
        }
        
        toast({
          title: "Алдаа",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Алдаа",
        description: "Серверийн алдаа гарлаа",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Админ нэвтрэх</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Имэйл</Label>
              <Input
                id="email"
                type="email"
                placeholder="Админ имэйл"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                placeholder="Нууц үг"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


