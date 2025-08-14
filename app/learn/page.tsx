"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CourseCard } from '@/components/courses/course-card'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Course {
  _id: string
  title: string
  description: string
  category?: string
  duration?: number
  instructor?: {
    name: string
  }
  lessons?: any[]
}

export default function LearnPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Learn page useEffect - status:', status, 'session:', session)
    
    if (status === 'loading') return

    if (!session?.user) {
      console.log('No session found, redirecting to login')
      router.push('/auth/login?callbackUrl=/learn')
      return
    }

    console.log('Session found, fetching enrolled courses')
    fetchEnrolledCourses()
  }, [session, status, router])

  const fetchEnrolledCourses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/users/enrollments')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Миний курсууд</h1>
          <p className="text-gray-600">Таны худалдан авч, бүртгүүлсэн сургалтууд</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Та одоогоор ямар нэг курс эзэмшээгүй байна
            </h3>
            <p className="text-gray-600 mb-6">
              Хамгийн түрүүнд курсийн хуудас руу орж худалдан авалт хийж бүртгүүлнэ үү.
            </p>
            <Button asChild>
              <Link href="/courses">Курсууд харах</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
