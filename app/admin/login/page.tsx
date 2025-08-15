"use client"

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
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
      
      console.log('Admin login page - Session status:', status)
      console.log('Admin login page - Session data:', session)
      
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/users/me')
          if (response.ok) {
            const user = await response.json()
            console.log('Admin login page - User data:', user)
            if (user.role === 'ADMIN') {
              const next = searchParams.get('next') || '/admin'
              console.log('Admin login page - Redirecting existing admin to:', next)
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
      console.log('Attempting login with:', email)
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        toast({
          title: "Алдаа",
          description: "Имэйл эсвэл нууц үг буруу байна",
          variant: "destructive",
        })
      } else if (result?.ok) {
        console.log('Login successful, checking admin role...')
        
        // Wait a bit for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if user has admin role after login
        try {
          const userResponse = await fetch('/api/users/me')
          console.log('User response status:', userResponse.status)
          
          if (userResponse.ok) {
            const user = await userResponse.json()
            console.log('User data:', user)
            
            if (user.role === 'ADMIN') {
              toast({
                title: "Амжилттай",
                description: "Админ хэсэгт нэвтэрлээ",
              })
              
              // Force redirect to admin panel using window.location
              const next = searchParams.get('next') || '/admin'
              console.log('Redirecting to admin panel:', next)
              
              // Try router.push first, then fallback to window.location
              try {
                router.push(next)
                // If router.push doesn't work, use window.location as fallback
                setTimeout(() => {
                  if (window.location.pathname !== next) {
                    console.log('Router push failed, using window.location fallback')
                    window.location.href = next
                  }
                }, 2000)
              } catch (redirectError) {
                console.error('Router redirect failed, using window.location:', redirectError)
                window.location.href = next
              }
              
            } else {
              toast({
                title: "Алдаа",
                description: "Та админ эрхгүй байна",
                variant: "destructive",
              })
              // Sign out the user since they don't have admin access
              await signOut({ redirect: false })
            }
          } else {
            const errorText = await userResponse.text()
            console.error('User API error:', errorText)
            toast({
              title: "Алдаа",
              description: "Хэрэглэгчийн мэдээлэл олдсонгүй",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error('Error checking user role:', error)
          toast({
            title: "Алдаа",
            description: "Хэрэглэгчийн мэдээлэл шалгахад алдаа гарлаа",
            variant: "destructive",
          })
        }
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


