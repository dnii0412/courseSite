"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export const NavLink = React.memo<NavLinkProps>(({ 
  href, 
  children, 
  disabled = false,
  className = ""
}) => {
  const pathname = usePathname()
  const isActive = pathname === href

  if (disabled) {
    return (
      <span 
        className={`relative px-3 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed ${className}`}
        aria-disabled="true"
      >
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      aria-current={isActive ? "page" : undefined}
      data-analytics="nav-link"
      data-analytics-href={href}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute inset-x-1 bottom-0 h-0.5 bg-primary"
          layoutId="navbar-underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  )
})

NavLink.displayName = "NavLink"
