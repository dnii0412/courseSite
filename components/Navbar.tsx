'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

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
    { name: 'Хичээлүүд', href: '/courses' },
    { name: 'Тусламж', href: '/help' },
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
  const { data } = useSession()
  const isAuthed = !!data?.user
  const currentUser = { name: data?.user?.name || '', image: data?.user?.image || '' }
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
      if (e.key === 'Escape') setMenuOpen(false)
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
      `sticky top-0 z-50 h-16 border-b ${
        scrolled
          ? 'bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-slate-900'
          : 'bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/70'
      } border-slate-200/70 dark:border-slate-800`,
    [scrolled]
  )

  const isActive = (href: string) => pathname?.startsWith(href)

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded-md">
              <Image src="/favicon.svg" alt="New Era" width={24} height={24} className="rounded" />
              <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">New Era</span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm transition-colors ${
                    active
                      ? 'text-slate-900 dark:text-slate-50 after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-sky-600 after:rounded'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthed ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white px-3 py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-sky-700 text-white hover:bg-sky-800 rounded-xl px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
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
                  className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
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
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-1 focus:outline-none"
                  >
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      role="menuitem"
                    >
                      Миний сургалтууд
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      role="menuitem"
                    >
                      Тохиргоо
                    </Link>
                    <button
                      onClick={() => (onSignOut ? onSignOut() : signOut())}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      role="menuitem"
                    >
                      Гарах
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span className="sr-only">Цэс нээх</span>
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
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
          className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="font-semibold tracking-tight" onClick={() => setMobileOpen(false)}>
              New Era
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Цэс хаах"
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
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
                  className={`block px-3 py-2 rounded-lg text-base ${
                    active
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-sky-700 text-white hover:bg-sky-800 rounded-xl px-4 py-2"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Image src={currentUser.image || '/placeholder-user.jpg'} alt={currentUser.name || 'User'} width={36} height={36} className="rounded-full" />
                  <div className="text-sm text-slate-800 dark:text-slate-200">{currentUser.name || 'Хэрэглэгч'}</div>
                </div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  Миний сургалтууд
                </Link>
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  Тохиргоо
                </Link>
                <button onClick={() => { setMobileOpen(false); (onSignOut ? onSignOut() : signOut()) }} className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  Гарах
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { useScrolled }


