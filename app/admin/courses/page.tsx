import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { CourseManagement } from '@/components/admin/course-management'

export default function AdminCoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Хичээл удирдах
            </h1>
            <p className="text-gray-600">
              Хичээлүүдийг нэмэх, засах, устгах
            </p>
          </div>

          <CourseManagement />
        </div>
      </div>
    </div>
  )
}
