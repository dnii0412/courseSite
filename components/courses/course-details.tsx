'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Users, Star, Play, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { PaymentModal } from '@/components/payments/payment-modal'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface CourseDetailsProps {
  course: {
    _id: string
    title: string
    description: string
    thumbnail: string
    price: number
    duration: number
    studentsCount: number
    rating: number
    instructor: {
      name: string
    }
    category: string
    lessons: Array<{
      _id: string
      title: string
      duration: number
      preview: boolean
    }>
    requirements: string[]
    whatYouWillLearn: string[]
  }
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const [showPayment, setShowPayment] = useState(false)
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

  const handleWatchCourse = () => {
    router.push(`/learn/${course._id}`)
  }

  const handlePaymentSuccess = () => {
    setIsEnrolled(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Badge className="mb-2">{course.category}</Badge>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.duration} цаг
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.studentsCount} оюутан
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {course.rating}
              </div>
            </div>
          </div>

          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList>
              <TabsTrigger value="curriculum">Хичээлийн хөтөлбөр</TabsTrigger>
              <TabsTrigger value="requirements">Шаардлага</TabsTrigger>
              <TabsTrigger value="instructor">Багш</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum" className="space-y-4">
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        {lesson.preview ? (
                          <Play className="w-4 h-4 text-blue-600" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-gray-500">{lesson.duration} минут</p>
                      </div>
                    </div>
                    {lesson.preview && (
                      <Badge variant="outline">Үнэгүй үзэх</Badge>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="requirements">
              <Card>
                <CardHeader>
                  <CardTitle>Шаардлага</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>Багшийн тухай</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-gray-600 mt-2">
                    Туршлагатай мэргэжилтэн
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={course.thumbnail || '/placeholder.svg?height=200&width=300&query=course preview'}
                  alt={course.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {course.price.toLocaleString()}₮
              </div>
              
              <div className="space-y-3 mb-6">
                <h4 className="font-medium">Энэ хичээлээс та:</h4>
                <ul className="space-y-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {!user ? (
                <Button className="w-full" size="lg" asChild>
                  <a href="/auth/login">Нэвтэрч бүртгүүлэх</a>
                </Button>
              ) : isLoading ? (
                <Button className="w-full" size="lg" disabled>
                  Шалгаж байна...
                </Button>
              ) : isEnrolled ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleWatchCourse}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Хичээл үзэх
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowPayment(true)}
                >
                  Хичээлд бүртгүүлэх
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
        course={course}
      />
    </div>
  )
}
