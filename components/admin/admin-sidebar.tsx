"use client"

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  CreditCard,
  Image,
  Database,
  Cog,
  Wrench,
  BarChart,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Хяналтын самбар',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Хичээлүүд',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Хэрэглэгчид',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Төлбөрүүд',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Медиа сан',
    href: '/admin/media-grid',
    icon: Image,
  },
  {
    title: 'Өгөгдлийн сан',
    href: '/admin/database',
    icon: Database,
  },
  {
    title: 'Нөөц хувилбар',
    href: '/admin/backup',
    icon: Cog,
  },
  {
    title: 'Тохиргоо',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [adminUser, setAdminUser] = useState<any>(null)

  // Get admin user info
  useEffect(() => {
    const getAdminUser = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setAdminUser(data.user)
        }
      } catch (error) {
        console.error('Error getting admin user:', error)
      }
    }

    getAdminUser()
  }, [])

  const handleLogout = async () => {
    try {
      // Call custom admin logout API
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Redirect to admin login
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback redirect
      window.location.href = '/admin/login'
    }
  }

  if (collapsed !== undefined) {
    // Desktop sidebar with collapse functionality
    return (
      <div className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-white border-r border-gray-200 min-h-screen flex flex-col`}> 
        <div className={`p-4 ${collapsed ? 'px-3' : ''} border-b border-gray-200`}>
        </div>

        <nav className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-xl transition-colors border-l-2 ${isActive
                    ? 'bg-gray-100 text-black border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-black border-transparent'
                  }`}
              >
                <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} shrink-0`} />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            )
          })}
        </nav>
        
        {/* Profile footer */}
        <div className="mt-auto p-3 border-t border-gray-200">
          {collapsed ? (
            <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-50 text-sm text-gray-700">
              Гарах
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-black truncate">{adminUser?.name || 'Админ'}</div>
                <div className="text-xs text-gray-500 truncate">{adminUser?.email || ''}</div>
              </div>
              <button onClick={handleLogout} className="text-xs text-black hover:underline">Гарах</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mobile sidebar
  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin</span>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {adminUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  {adminUser?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5',
                        isActive ? 'text-blue-700' : 'text-gray-400'
                      )}
                    />
                    {item.title}
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Гарах
            </Button>
          </div>
        </div>
      </div>

      {/* Main content margin */}
      <div className="md:ml-64" />
    </>
  )
}
