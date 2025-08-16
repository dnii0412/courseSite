'use client'

import { useEffect, useState } from 'react'
import { VideoPlayer } from '@/components/video/video-player'
import { LessonSidebar } from '@/components/learn/lesson-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Play, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Lesson {
  _id: string
  title: string
  description?: string
  duration?: number
  videoUrl?: string
  videoStatus?: string
  videoId?: string
  videoFile?: string
  isCompleted?: boolean
}

interface Course {
  _id: string
  title: string
  description?: string
  subcourses?: any[]
  lessons?: any[]
}

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [lessonRes, courseRes] = await Promise.all([
          fetch(`/api/lessons/${params.lessonId}`),
          fetch(`/api/courses/${params.courseId}`)
        ])
        
        if (!lessonRes.ok || !courseRes.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const lessonData = await lessonRes.json()
        const courseData = await courseRes.json()
        
        setLesson(lessonData.data || lessonData)
        setCourse(courseData.data || courseData)
      } catch (err) {
        setError('Failed to fetch lesson or course data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.courseId, params.lessonId])

  const handleToggleCompletion = async () => {
    if (!lesson) return
    
    try {
      const response = await fetch(`/api/lessons/${lesson._id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !lesson.isCompleted }),
      })

      if (response.ok) {
        // Update local state
        setLesson(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null)
      } else {
        console.error('Failed to update lesson completion')
      }
    } catch (error) {
      console.error('Error updating lesson completion:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  if (!lesson || !course) {
    return <div className="text-center py-12">Lesson or Course not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <Button
              onClick={handleToggleCompletion}
              variant={lesson.isCompleted ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              {lesson.isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Mark Incomplete
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration || 0} минут</span>
            </div>
            {lesson.videoStatus && (
              <Badge 
                variant={lesson.videoStatus === 'uploaded' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {lesson.videoStatus === 'uploaded' ? (
                  <>
                    <Play className="w-3 h-3" />
                    Видео бэлэн
                  </>
                ) : lesson.videoStatus === 'pending' ? (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Видео хүлээгдэж байна
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    {lesson.videoStatus}
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <LessonSidebar 
              courseId={params.courseId}
              currentLessonId={params.lessonId}
              course={course as any}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            {lesson.videoUrl && lesson.videoStatus === 'uploaded' ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Хичээлийн видео</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <VideoPlayer 
                      videoUrl={lesson.videoUrl}
                      title={lesson.title}
                      courseId={params.courseId}
                      lessonId={params.lessonId}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : lesson.videoStatus === 'pending' ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Видео хүлээгдэж байна</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Энэ хичээлийн видео одоогоор бэлдэж байна. 
                      <br />
                      Тун удахгүй харах боломжтой болно.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : lesson.videoFile && !lesson.videoUrl ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Видео байршуулж байна</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Play className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Видео файл: {lesson.videoFile}
                      <br />
                      Байршуулж байна...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Видео олдсонгүй</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Энэ хичээлд видео холбогдоогүй байна.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            {lesson.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Хичээлийн тайлбар</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{lesson.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


