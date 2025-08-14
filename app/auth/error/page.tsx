"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const router = useRouter()

  useEffect(() => {
    // If it's an OAuthAccountNotLinked error, it means the user successfully logged in
    // but NextAuth is being picky about account linking. Redirect them to courses.
    if (error === 'OAuthAccountNotLinked') {
      console.log('OAuth login successful, redirecting to courses...')
      router.push('/courses')
      return
    }
  }, [error, router])

  // If it's OAuthAccountNotLinked, show a loading message while redirecting
  if (error === 'OAuthAccountNotLinked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
            <div className="h-11 bg-gray-200 rounded mb-3"></div>
            <div className="h-11 bg-gray-200 rounded"></div>
          </div>
          <p className="mt-4 text-sm text-gray-600">Нэвтэрч байна...</p>
        </div>
      </div>
    )
  }

  // For other errors, show the normal error page
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Алдаа гарлаа</h1>

        {error === 'Configuration' && (
          <p className="text-gray-600 mb-6">Серверийн тохиргоонд алдаа гарлаа.</p>
        )}
        {error === 'AccessDenied' && (
          <p className="text-gray-600 mb-6">Нэвтрэх эрх татагдаагүй байна.</p>
        )}
        {error === 'Verification' && (
          <p className="text-gray-600 mb-6">Баталгаажуулалт амжилтгүй болсон.</p>
        )}
        {error === 'Default' && (
          <p className="text-gray-600 mb-6">Нэвтрэхэд алдаа гарлаа.</p>
        )}
        {error && !['Configuration', 'AccessDenied', 'Verification', 'Default'].includes(error) && (
          <p className="text-gray-600 mb-6">Нэвтрэхэд алдаа гарлаа: {error}</p>
        )}

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Нэвтрэх хуудас руу буцах
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            Үндсэн хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
            <div className="h-11 bg-gray-200 rounded mb-3"></div>
            <div className="h-11 bg-gray-200 rounded"></div>
          </div>
          <p className="mt-4 text-sm text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
