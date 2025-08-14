import { getCourses } from '@/lib/api/courses'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle } from 'lucide-react'

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Хичээлүүд</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Мэргэжлийн багш нартай, чанартай видео хичээлүүдээр таны ур чадварыг хөгжүүлнэ
          </p>
        </div>
        
        {/* Scrollable Table Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Courses</h2>
            </div>
            
            {/* Scrollable Table Body */}
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <div key={course._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                            {course.category || 'Ерөнхий'}
                          </Badge>
                          {/* Enrollment status would go here if needed */}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Худалдан авах
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Overlay for remaining courses */}
          {courses.length > 6 && (
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent h-20"></div>
                <div className="relative z-10">
                  <p className="text-gray-600 mb-4">Scroll to see more courses</p>
                  <div className="w-8 h-8 mx-auto border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
