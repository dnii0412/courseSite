import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === 'loading') return
      
      if (status === 'unauthenticated') {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      if (session?.user?.email) {
        try {
          // Check if user has admin role
          const response = await fetch('/api/users/me')
          if (response.ok) {
            const user = await response.json()
            if (user.role === 'ADMIN') {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
              // Redirect non-admin users
              router.push('/auth/login')
            }
          } else {
            setIsAdmin(false)
            router.push('/auth/login')
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
          router.push('/auth/login')
        }
      }
      
      setIsLoading(false)
    }

    checkAdminStatus()
  }, [session, status, router])

  return { isAdmin, isLoading, session, status }
}
