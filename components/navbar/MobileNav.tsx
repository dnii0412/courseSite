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
import { useSession } from "next-auth/react"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface MobileNavProps {}

export function MobileNav({}: MobileNavProps) {
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
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 md:hidden"
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
          <div className="mt-6 flex flex-col space-y-2">
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

            {/* Auth Buttons */}
            {session ? (
              <>
                <NavLink
                  href="/dashboard"
                  className="text-sm"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                    setOpen(false)
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block rounded-lg border border-input bg-background px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                  data-analytics="mobile-nav-login"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block rounded-lg bg-blue-600 px-2 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => setOpen(false)}
                  data-analytics="mobile-nav-register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
