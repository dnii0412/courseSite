import { CourseManagement } from '@/components/admin/course-management'
// removed FiltersBar per request

export default function AdminCoursesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-0" />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 mt-4">
        <div className="text-black">
          <CourseManagement />
        </div>
      </div>
    </div>
  );
}
