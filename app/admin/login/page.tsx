"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user is already admin and redirect
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === 'loading') return
      
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/users/me')
          if (response.ok) {
            const user = await response.json()
            if (user.role === 'ADMIN') {
              const next = searchParams.get('next') || '/admin'
              router.push(next)
            }
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
        }
      }
    }

    checkAdminStatus()
  }, [session, status, router, searchParams])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        // Check if user has admin role after login
        const userResponse = await fetch('/api/users/me')
        if (userResponse.ok) {
          const user = await userResponse.json()
          if (user.role === 'ADMIN') {
            toast({
              title: "Амжилттай",
              description: "Админ хэсэгт нэвтэрлээ",
            })
            const next = searchParams.get('next') || '/admin'
            router.push(next)
          } else {
            toast({
              title: "Алдаа",
              description: "Та админ эрхгүй байна",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Алдаа",
            description: "Хэрэглэгчийн мэдээлэл олдсонгүй",
            variant: "destructive",
          })
        }
      } else {
        const data = await response.json()
        toast({
          title: "Алдаа",
          description: data.error || "Нэвтрэхэд алдаа гарлаа",
          variant: "destructive",
        })
      }
    } catch (error) {
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


