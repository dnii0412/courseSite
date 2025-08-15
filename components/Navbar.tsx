'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, ChevronDown } from 'lucide-react'

export type NavItem = { name: string; href: string }

export interface NavbarProps {
  items?: NavItem[]
  isAuthenticated?: boolean
  user?: { name?: string; image?: string }
  onSignOut?: () => void
}

function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

export default function Navbar({
  items = [
    { name: 'Нүүр', href: '/' },
    { name: 'Хичээлүүд', href: '/courses' },
  ],
  isAuthenticated = false,
  user,
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname?.() || '/'
  const scrolled = useScrolled(16)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()

  // Debug session state
  console.log('Navbar - Session status:', status)
  console.log('Navbar - Session data:', session)

  const isAuthed = !!session?.user
  const currentUser = {
    name: session?.user?.name || user?.name || '',
    image: session?.user?.image || user?.image || ''
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [mobileOpen])

  // Close user menu on outside click / ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setMobileOpen(false)
      }
    }
    function onClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  const headerClass = useMemo(
    () =>
      `sticky top-0 z-50 h-16 border-b ${scrolled
        ? 'bg-white shadow-sm dark:bg-neutral-900'
        : 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:bg-neutral-900/95'
      } border-neutral-200 dark:border-neutral-800`,
    [scrolled]
  )

  const isActive = (href: string) => pathname === href

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NE</span>
            </div>
            <span className="font-semibold tracking-tight text-neutral-900 dark:text-white">
              New Era
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm transition-colors ${active
                    ? 'text-neutral-900 dark:text-neutral-50 after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-neutral-600 after:rounded'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-neutral-200 rounded animate-pulse"></div>
              </div>
            ) : !isAuthed ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white px-3 py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  <Image
                    src={currentUser.image || '/placeholder-user.jpg'}
                    alt={currentUser.name || 'User'}
                    width={36}
                    height={36}
                    className="w-9 h-9 object-cover"
                  />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    tabIndex={-1}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg p-1 focus:outline-none"
                  >
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      role="menuitem"
                    >
                      Профайл
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      role="menuitem"
                    >
                      Миний сургалтууд
                    </Link>

                    <button
                      onClick={() => (onSignOut ? onSignOut() : signOut())}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      role="menuitem"
                    >
                      Гарах
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-md text-neutral-700 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label="Цэс нээх"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
            <Link href="/" className="font-semibold tracking-tight" onClick={() => setMobileOpen(false)}>
              New Era
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Цэс хаах"
              className="p-2 rounded-md text-neutral-700 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="px-4 py-4 space-y-1" aria-label="Main Navigation">
            {items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base ${active
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="px-4 py-4 border-t border-neutral-200 dark:border-neutral-800">
            {!isAuthed ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-800 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-xl transition-colors"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Image
                    src={currentUser.image || '/placeholder-user.jpg'}
                    alt={currentUser.name || 'User'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {currentUser.name || 'User'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Профайл
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Миний сургалтууд
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut ? onSignOut() : signOut()
                      setMobileOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Гарах
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
