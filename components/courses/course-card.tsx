"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          {session?.user ? (
            // Show Pay Now button for registered users
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
          ) : (
            // Show Register button for non-registered users
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleEnroll}
              disabled={isProcessing}
            >
              {isProcessing ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
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
