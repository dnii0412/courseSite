'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Database,
  Grid3X3
} from 'lucide-react'

const menuItems = [
  {
    title: 'Нүүр',
    href: '/admin',
    icon: Home
  },
  {
    title: 'Хэрэглэгчид',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Сургалтууд',
    href: '/admin/courses',
    icon: BookOpen
  },
  {
    title: 'Media Grid',
    href: '/admin/media-grid',
    icon: Grid3X3
  },
  {
    title: 'Төлбөрүүд',
    href: '/admin/payments',
    icon: CreditCard
  },
  {
    title: 'Өгөгдлийн сан',
    href: '/admin/database',
    icon: Database
  },
  {
    title: 'Тохиргоо',
    href: '/admin/settings',
    icon: Settings
  }
]

import { useAuth } from '@/hooks/use-auth'

export function AdminSidebar({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-white border-r border-sand-200 min-h-screen flex flex-col`}> 
      <div className={`p-4 ${collapsed ? 'px-3' : ''} border-b border-sand-200`}> 
        {collapsed ? (
          <div className="h-8 w-8 rounded-lg bg-[#1B3C53]" aria-label="Brand" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#1B3C53]" />
              <span className="text-sm font-semibold text-[#1B3C53]">Админ</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9F3EF] text-[#1B3C53] border">Admin</span>
          </div>
        )}
      </div>

        {!collapsed && (
          <div className="p-3 border-b border-sand-200">
            <input
              className="w-full px-3 py-2 text-sm rounded-xl border border-sand-200 bg-white placeholder:text-ink-500"
              placeholder="Хайх"
            />
          </div>
        )}

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-xl transition-colors border-l-2 ${isActive
                    ? 'bg-sand-100 text-ink-900 border-sand-200'
                    : 'text-ink-700 hover:bg-sand-50 hover:text-ink-900 border-transparent'
                  }`}
              >
                <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} shrink-0`} />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            )
          })}
        </nav>
        {/* Profile footer */}
        <div className="mt-auto p-3 border-t border-sand-200">
          {collapsed ? (
            <button onClick={logout} className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-50 text-sm text-gray-700">
              Гарах
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Админ'}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
              </div>
              <button onClick={logout} className="text-xs text-[#1B3C53] hover:underline">Гарах</button>
            </div>
          )}
        </div>
    </div>
  )
}
