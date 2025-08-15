"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Play, Clock, Users, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CourseCardProps {
  course: {
    _id: string
    title: string
    description: string
    price: number
    duration: string
    level: string
    rating: number
    enrolledCount: number
    lessonCount: number
    image?: string
    category: string
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    if (!session?.user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login'
      return
    }

    setIsProcessing(true)
    try {
      // Create payment order
      const response = await fetch('/api/payments/byl/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course._id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          // Redirect to payment page
          window.location.href = data.url
        } else {
          console.error('No payment URL received')
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to create payment:', errorData.error)
        alert('Төлбөр үүсгэхэд алдаа гарлаа: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Төлбөр үүсгэхэд алдаа гарлаа')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEnroll = async () => {
    if (!session?.user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login'
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/users/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course._id,
        }),
      })

      if (response.ok) {
        // Redirect to the course learning page
        window.location.href = `/learn/${course._id}`
      } else {
        const errorData = await response.json()
        console.error('Failed to enroll in course:', errorData.error)
        alert('Хичээлд бүртгүүлэхэд алдаа гарлаа: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      alert('Хичээлд бүртгүүлэхэд алдаа гарлаа')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white">
      {/* Course Image */}
      <div className="relative overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-blue-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 border-0 shadow-sm">
            {course.category}
          </Badge>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm">
            {course.level}
          </Badge>
        </div>
        
        {/* Price Overlay */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-lg font-bold text-blue-600">₮{course.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Course Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {course.title}
        </h3>
        
        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
        
        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{course.enrolledCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4 text-green-500" />
            <span>{course.lessonCount} хичээл</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>{course.duration}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="flex gap-2 w-full">
          {session?.user ? (
            // Show Pay Now button for registered users
            <Button
              variant="default"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Уучлаарай...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Төлбөр төлөх
                </>
              )}
            </Button>
          ) : (
            // Show Register button for non-registered users
            <Button
              variant="outline"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              onClick={handleEnroll}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Бүртгэж байна...</span>
                </div>
              ) : (
                'Бүртгүүлэх'
              )}
            </Button>
          )}
          
          <Button asChild variant="ghost" size="sm" className="px-3 hover:bg-gray-100 transition-colors duration-200">
            <Link href={`/courses/${course._id}`} className="text-gray-600 hover:text-gray-900">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
