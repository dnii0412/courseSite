"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavLink } from "./NavLink"
import { mainNavItems } from "@/lib/nav"
import { getI18nText } from "@/lib/nav"
import { ModeToggle } from "@/components/theme/ModeToggle"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface MobileNavProps {
  language: 'mn' | 'en'
  onLanguageToggle: () => void
}

export function MobileNav({ language, onLanguageToggle }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const { data: session } = useSession()

  // Prevent body scroll when mobile nav is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 lg:hidden"
          data-analytics="mobile-nav-toggle"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-2">
          <SheetHeader className="px-2">
            <SheetTitle className="text-left text-lg font-semibold">
              New Era
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col space-y-4">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  disabled={item.disabled}
                  className="text-lg"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-4 h-px bg-border" />

            {/* Language Toggle */}
            <Button
              variant="ghost"
              onClick={onLanguageToggle}
              className="justify-start text-lg"
              data-analytics="language-toggle-mobile"
            >
              Language: {language.toUpperCase()}
            </Button>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-lg">Theme</span>
              <ModeToggle />
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-border" />

            {/* Auth Buttons */}
            <div className="flex flex-col space-y-2">
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {getI18nText(language, 'profile')}: {session.user?.name}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-lg font-medium hover:bg-accent"
                    onClick={() => setOpen(false)}
                    data-analytics="mobile-nav-dashboard"
                  >
                    {getI18nText(language, 'dashboard')}
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      // Handle logout
                      setOpen(false)
                    }}
                    data-analytics="mobile-nav-logout"
                  >
                    {getI18nText(language, 'logout')}
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block rounded-lg border border-input bg-background px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                    data-analytics="mobile-nav-login"
                  >
                    {getI18nText(language, 'login')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block rounded-lg bg-blue-600 px-3 py-2 text-lg font-medium text-white hover:bg-blue-700"
                    onClick={() => setOpen(false)}
                    data-analytics="mobile-nav-register"
                  >
                    {getI18nText(language, 'register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
