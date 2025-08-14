import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminStats } from '@/components/admin/admin-stats'
import { RecentEnrollments } from '@/components/admin/recent-enrollments'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              System Dashboard
            </p>
          </div>

          <div className="grid gap-8">
            <AdminStats />
            <RecentEnrollments />
          </div>
        </div>
      </div>
    </div>
  )
}
