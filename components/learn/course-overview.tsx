"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Course {
  _id: string
  title: string
  description: string
  subcourses?: any[]
  completedLessons?: number
  totalDuration?: number
}

interface Subcourse {
  _id: string
  title: string
  description: string
  lessons?: any[]
}

interface Lesson {
  _id: string
  title: string
  description: string
  isCompleted?: boolean
  isLocked?: boolean
}

interface CourseOverviewProps {
  course: Course
}

export function CourseOverview({ course }: CourseOverviewProps) {
  // Calculate progress percentage
  const progressPercentage = course.completedLessons && course.totalDuration 
    ? (course.completedLessons / course.totalDuration) * 100 
    : 0

  // Get current lesson for continue learning
  const currentLessonForContinue = course.subcourses?.[0]?.lessons?.[0]?._id

  const handleContinueLearning = () => {
    if (currentLessonForContinue) {
      window.location.href = `/learn/${course._id}/${currentLessonForContinue}`
    }
  }

  const handleLessonClick = (lessonId: string) => {
    window.location.href = `/learn/${course._id}/${lessonId}`
  }

  const handleToggleCompletion = async (lessonId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentStatus }),
      })

      if (response.ok) {
        // Refresh the page to show updated completion status
        window.location.reload()
      } else {
        console.error('Failed to update lesson completion')
      }
    } catch (error) {
      console.error('Error updating lesson completion:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {course.subcourses && Array.isArray(course.subcourses) && course.subcourses.length > 0 ? (
        course.subcourses.map((subcourse: any, subIndex: number) => {
          if (!subcourse || !subcourse._id) return null
          
          const lessonsCount = subcourse.lessons?.length || 0
          const completedLessons = subcourse.lessons?.filter((l: any) => l.isCompleted)?.length || 0
          const progressPercentage = lessonsCount > 0 ? Math.round((completedLessons / lessonsCount) * 100) : 0

          return (
            <div key={subcourse._id} className="mb-8">
              {/* Module Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Module {subIndex + 1}: {subcourse.title || 'Untitled Module'}
                </h2>
              </div>

              {/* Module Content */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  {subcourse.lessons && Array.isArray(subcourse.lessons) && subcourse.lessons.length > 0 ? (
                    subcourse.lessons.map((lesson: any, lessonIndex: number) => {
                      if (!lesson || !lesson._id) return null
                      
                      const isCompleted = lesson.isCompleted
                      const duration = lesson.duration || 0

                      return (
                        <div 
                          key={lesson._id} 
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            isCompleted 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            
                            <span className="font-medium text-gray-900">
                              {lesson.title || `Lesson ${lessonIndex + 1}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {duration > 0 && (
                              <span className="text-sm text-gray-600">{duration} min</span>
                            )}
                            {isCompleted ? (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleLessonClick(lesson._id)}
                                className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                              >
                                <span className="text-white text-sm">▶</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No lessons available
                    </div>
                  )}
                </div>
                
                {/* Module Progress Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{completedLessons}/{lessonsCount} lessons • {progressPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Modules Available</h3>
          <p className="text-gray-600">
            This course doesn't have any modules yet.
          </p>
        </div>
      )}
    </div>
  )
}
