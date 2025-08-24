import type React from "react"
import type { Metadata } from "next/server"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/hooks/useAuth"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "New Era - Online Learning Platform",
  description: "Чанартай хичээллүүд. Хэзээ ч, хаанаас ч.",
  generator: "New Era Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
