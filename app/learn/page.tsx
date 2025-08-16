'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, BookOpen, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface EnrolledCourse {
  _id: string
  title: string
  description: string
  thumbnail?: string
  enrolledCourses?: any[]
  progress?: number
  lastAccessed?: string
}

export default function LearnPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchEnrolledCourses()
    }
  }, [session])

  const fetchEnrolledCourses = async () => {
    try {
      const res = await fetch('/api/users/me', {
        credentials: 'include'
      })
      if (res.ok) {
        const userData = await res.json()
        if (userData.enrolledCourses) {
          setEnrolledCourses(userData.enrolledCourses)
        }
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Миний сургалтууд
          </h1>
          <p className="text-gray-600">
            Таны элссэн хичээлүүд болон явц
          </p>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-500 mb-4">Одоогоор элссэн хичээл байхгүй байна.</p>
            <Button asChild>
              <Link href="/courses">Хичээлүүд үзэх</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>
                  
                  {course.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Явц</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Хичээл</span>
                    </div>
                    <Button 
                      asChild 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Link href={`/learn/${course._id}`}>
                        {course.progress && course.progress > 0 ? (
                          <>
                            <Play className="w-4 h-4" />
                            Үргэлжлүүлэх
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            Эхлэх
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
