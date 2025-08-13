import { CourseManagement } from '@/components/admin/course-management'
import { FiltersBar } from '@/components/admin/filters-bar'

export default function AdminCoursesPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      <FiltersBar sticky>{/* Future: category, price, status, sort */}</FiltersBar>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 mt-4">
        <CourseManagement />
      </div>
    </div>
  )
}
