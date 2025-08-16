'use client'

import { CourseOverview } from '@/components/learn/course-overview'
import { useEffect, useState } from 'react'

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/courses/${params.courseId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Course not found')
          } else {
            setError('Failed to load course')
          }
        } else {
          const result = await response.json()
          if (result.success) {
            setCourse(result.data)
          } else {
            setError('Failed to load course')
          }
        }
      } catch (err) {
        setError('Failed to load course')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const calculateOverallProgress = () => {
    if (!course.completedLessons || !course.totalDuration) {
      return 0;
    }
    return (course.completedLessons / course.totalDuration) * 100;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                ←
              </button>
              <nav className="text-sm text-gray-600">
                <span>Home</span>
                <span className="mx-2">&gt;</span>
                <span>Courses</span>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-900 font-medium">{course.title}</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full border-2 border-gray-400"></div>
              <button className="text-gray-600 hover:text-gray-900 text-xl">=</button>
            </div>
          </div>
        </div>

        {/* Course Header Section */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 uppercase">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-8">{course.description || 'Course description goes here'}</p>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Section */}
        <div className="px-6 py-8">
          <CourseOverview course={course} />
        </div>
      </div>
    </div>
  )
}
