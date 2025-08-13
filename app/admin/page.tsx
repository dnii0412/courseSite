import { AdminTopbar } from '@/components/admin/topbar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import AdminDashboard from '@/components/admin/dashboard'

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-2 md:px-6 grid gap-6 md:gap-8">
      <AdminTopbar title="Админ самбар" actions={<ThemeToggle />}>
        <div className="text-sm text-gray-600">Ерөнхий тойм</div>
      </AdminTopbar>
      <AdminDashboard />
    </div>
  )
}
