'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, User, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
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
  const { user } = useAuth()
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">
            {course.category || 'Ерөнхий'}
          </Badge>
          {isEnrolled && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Бүртгэлтэй
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {course.duration || 0} мин
        </div>
        <CardTitle className="text-lg">{course.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            {course.instructor?.name || 'Багш'}
          </div>
          <div className="text-sm text-gray-500">
            {course.lessons?.length || 0} хичээл
          </div>
        </div>
        
        <Button 
          className="w-full" 
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
