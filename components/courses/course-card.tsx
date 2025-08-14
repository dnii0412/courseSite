'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/enrollments/check/${course._id}`, { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setIsEnrolled(Boolean(data?.enrolled))
        } else {
          setIsEnrolled(false)
        }
      } catch (error) {
        console.error('Error checking enrollment:', error)
        setIsEnrolled(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnrollment()
  }, [user, course._id])

  const handleCourseClick = () => {
    if (isEnrolled) {
      router.push(`/learn/${course._id}`)
    } else {
      router.push(`/courses/${course._id}`)
    }
  }

  return (
    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
            {course.category || 'Ерөнхий'}
          </Badge>
          {isEnrolled && (
            <Badge variant="default" className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Бүртгэлтэй
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg text-gray-900">{course.title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          onClick={handleCourseClick}
          disabled={isLoading}
        >
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? 'Шалгаж байна...' : isEnrolled ? 'Үргэлжлүүлэх' : 'Худалдан авах'}
        </Button>
      </CardContent>
    </Card>
  )
}
