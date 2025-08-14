import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

import Navbar from '@/components/Navbar'
import SessionProviderClient from '@/components/providers/session-provider'
import { PasswordToggleProvider } from '@/components/providers/password-toggle-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'New Era - Online Learning Platform',
  description: 'Онлайн сургалтын платформ',
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} bg-white text-neutral-900`}>
        <SessionProviderClient>
          <PasswordToggleProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </PasswordToggleProvider>
        </SessionProviderClient>
      </body>
    </html>
  )
}
