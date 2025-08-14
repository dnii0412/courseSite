'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Серверийн тохиргооны алдаа. Админтай холбогдоно уу.'
      case 'AccessDenied':
        return 'Хандалт хүрээгүй. Таны бүртгэл идэвхгүй байна.'
      case 'Verification':
        return 'Баталгаажуулалтын алдаа. Дахин оролдоно уу.'
      case 'Callback':
        return 'Нэвтрэх үйл явцын алдаа. Дахин оролдоно уу.'
      case 'OAuthSignin':
        return 'Google нэвтрэх алдаа. Дахин оролдоно уу.'
      case 'OAuthCallback':
        return 'Google callback алдаа. Дахин оролдоно уу.'
      case 'OAuthCreateAccount':
        return 'Бүртгэл үүсгэх алдаа. Дахин оролдоно уу.'
      case 'EmailCreateAccount':
        return 'Имэйл бүртгэл үүсгэх алдаа. Дахин оролдоно уу.'
      case 'Callback':
        return 'Callback алдаа. Дахин оролдоно уу.'
      case 'OAuthAccountNotLinked':
        return 'Энэ имэйл хаяг өөр бүртгэлтэй холбогдсон байна.'
      case 'EmailSignin':
        return 'Имэйл илгээх алдаа. Дахин оролдоно уу.'
      case 'CredentialsSignin':
        return 'Имэйл эсвэл нууц үг буруу байна.'
      case 'SessionRequired':
        return 'Нэвтрэх шаардлагатай.'
      default:
        return 'Алдаа гарлаа. Дахин оролдоно уу.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Алдаа гарлаа</h1>
        <p className="text-slate-600 mb-6">
          {getErrorMessage(error)}
        </p>

        {error && (
          <div className="bg-slate-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-slate-500 font-mono">
              Error: {error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/auth/login" 
            className="w-full inline-flex items-center justify-center h-11 rounded-xl bg-sky-700 text-white hover:bg-sky-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Нэвтрэх хуудас руу буцах
          </Link>
          
          <Link 
            href="/" 
            className="w-full inline-flex items-center justify-center h-11 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Үндсэн хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  )
}
