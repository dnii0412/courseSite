'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Сургалтын төв
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">
              Хичээлүүд
            </Link>
            
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="max-w-[200px]">
                      <User className="w-4 h-4 mr-2" />
                      <span className="truncate">{user.name || user.email || 'Хэрэглэгч'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Профайл</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/learn">Миний курсууд</Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Админ самбар</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Гарах
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Нэвтрэх</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Бүртгүүлэх</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile profile + menu buttons */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="max-w-[140px]">
                    <User className="w-4 h-4 mr-2" />
                    <span className="truncate">{user.name || user.email || 'Хэрэглэгч'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Профайл</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/learn">Миний курсууд</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Админ самбар</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Гарах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Нэвтрэх</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/courses" className="text-gray-700 hover:text-blue-600">
                Хичээлүүд
              </Link>
              
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                    Профайл
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                      Админ самбар
                    </Link>
                  )}
                  <Button variant="ghost" onClick={logout} className="justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Гарах
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                    Нэвтрэх
                  </Link>
                  <Link href="/auth/register" className="text-gray-700 hover:text-blue-600">
                    Бүртгүүлэх
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
