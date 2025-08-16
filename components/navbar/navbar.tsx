"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  User,
  LogOut,
  Settings,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavLink } from "./NavLink"
import { MobileNav } from "./MobileNav"
import { SearchKbd } from "./SearchKbd"
import { ModeToggle } from "@/components/theme/ModeToggle"
import { mainNavItems, userNavItems, getI18nText } from "@/lib/nav"

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const language: 'mn' | 'en' = 'mn' // Fixed language
  const { data: session } = useSession()
  const pathname = usePathname()

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't show navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-neutral-900/95 shadow-sm backdrop-blur-xl'
        : 'bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl'
        } border-b border-black/5 dark:border-white/5`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" data-analytics="logo">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                NE
              </div>
              <span className="hidden font-bold sm:inline-block text-xl">
                New Era
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="max-md:hidden flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                disabled={item.disabled}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">

            {/* Auth Section */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full max-md:hidden flex items-center justify-center p-0 overflow-hidden"
                    data-analytics="user-menu"
                  >
                    <Avatar className="h-9 w-9 flex items-center justify-center">
                      <AvatarImage 
                        src={session.user?.image || ''} 
                        alt={session.user?.name || ''} 
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="flex items-center justify-center w-full h-full text-sm font-medium">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="cursor-pointer"
                        data-analytics="user-menu-item"
                        data-analytics-href={item.href}
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    data-analytics="user-menu-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {getI18nText(language, 'nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="max-md:hidden flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  data-analytics="nav-login"
                >
                  <Link href="/auth/login">
                    {getI18nText(language, 'nav.login')}
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  asChild
                  data-analytics="nav-register"
                >
                  <Link href="/auth/register">
                    {getI18nText(language, 'nav.register')}
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
