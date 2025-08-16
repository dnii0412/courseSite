import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === 'loading' || isChecking) return
      
      if (status === 'unauthenticated') {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      if (session?.user?.email) {
        try {
          setIsChecking(true)
          // Check if user has admin role
          const response = await fetch('/api/users/me')
          if (response.ok) {
            const user = await response.json()
            if (user.role === 'admin') {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
              // Add a small delay before redirecting to prevent interference with login
              setTimeout(() => {
                router.push('/admin/login')
              }, 100)
            }
          } else {
            setIsAdmin(false)
            // Add a small delay before redirecting to prevent interference with login
            setTimeout(() => {
              router.push('/admin/login')
            }, 100)
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
          // Add a small delay before redirecting to prevent interference with login
          setTimeout(() => {
            router.push('/admin/login')
          }, 100)
        } finally {
          setIsChecking(false)
        }
      }
      
      setIsLoading(false)
    }

    // Add a small delay to prevent interference with login process
    const timeoutId = setTimeout(checkAdminStatus, 500)
    
    return () => clearTimeout(timeoutId)
  }, [session, status, router, isChecking])

  return { isAdmin, isLoading, session, status }
}
