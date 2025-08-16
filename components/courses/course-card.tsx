"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { CreditCard, Play, CheckCircle } from 'lucide-react'

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
    isEnrolled?: boolean
    lessons?: { _id: string; title: string; duration: string }[]
  }
}

export function CourseCard({ course }: CourseCardProps) {

  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)

  // Check enrollment status when component mounts or session changes
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!session?.user) {
        setIsEnrolled(false)
        setIsCheckingEnrollment(false)
        return
      }

      try {
        const response = await fetch(`/api/enrollments/check/${course._id}`)
        if (response.ok) {
          const data = await response.json()
          setIsEnrolled(data.enrolled)
        } else {
          setIsEnrolled(false)
        }
      } catch (error) {
        console.error('Error checking enrollment:', error)
        setIsEnrolled(false)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    checkEnrollment()
  }, [session, course._id])

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
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 p-4">
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={course.image || '/placeholder.jpg'}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{course.lessons?.length || 0} хичээл</span>
            <span>{course.duration || '0 мин'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">₮{course.price?.toLocaleString() || 0}</span>
            {isEnrolled && (
              <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Бүртгэгдсэн
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          {!session?.user ? (
            // Show Register button for non-registered users
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleEnroll}
              disabled={isProcessing}
            >
              {isProcessing ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
            </Button>
          ) : isCheckingEnrollment ? (
            // Show loading state while checking enrollment
            <Button variant="outline" className="flex-1" disabled>
              Шалгаж байна...
            </Button>
          ) : isEnrolled ? (
            // Show Continue Learning button for enrolled users
            <Button
              variant="default"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link href={`/learn/${course._id}`}>
                <Play className="w-4 h-4 mr-2" />
                Сургалтаа үргэлжлүүлэх
              </Link>
            </Button>
          ) : (
            // Show Pay Now button for non-enrolled users
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Уучлаарай...'
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Төлбөр төлөх
                </>
              )}
            </Button>
          )}
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/courses/${course._id}`}>
              Дэлгэрэнгүй
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
