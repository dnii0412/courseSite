'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  BookOpen, 
  CreditCard, 
  Settings,
  Database
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

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-8">
          Админ самбар
        </h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
