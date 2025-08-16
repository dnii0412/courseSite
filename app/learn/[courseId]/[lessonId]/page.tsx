import { getLessonById } from '@/lib/api/lessons'
import { getCourseWithLessons } from '@/lib/api/courses'
import { notFound } from 'next/navigation'
import { VideoPlayer } from '@/components/video/video-player'
import { LessonSidebar } from '@/components/learn/lesson-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Play, AlertCircle } from 'lucide-react'

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const [lesson, course] = await Promise.all([
    getLessonById(params.lessonId),
    getCourseWithLessons(params.courseId)
  ])

  if (!lesson || !course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration} минут</span>
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
              course={course}
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

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Debug Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Video Information:</h4>
                      <div className="text-sm space-y-1">
                        <div><strong>Video URL:</strong> {lesson.videoUrl || 'None'}</div>
                        <div><strong>Video ID:</strong> {lesson.videoId || 'None'}</div>
                        <div><strong>Video Status:</strong> {lesson.videoStatus || 'None'}</div>
                        <div><strong>Video File:</strong> {lesson.videoFile || 'None'}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Full Lesson Data:</h4>
                      <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(lesson, null, 2)}
                      </pre>
                    </div>
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


