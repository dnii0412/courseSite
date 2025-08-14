"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

function OnboardingContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const fromRegister = searchParams.get('from') === 'register'
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (status === 'loading') return

        if (!session) {
            router.push('/auth/login?error=unauthenticated')
            return
        }

        // If user already has a role, redirect them
        if (session.user?.role) {
            router.push('/dashboard')
        }
    }, [session, status, router])

    const handleCompleteOnboarding = async () => {
        setIsLoading(true)
        try {
            // Here you could update the user's profile or complete onboarding
            // For now, just redirect to dashboard
            router.push('/dashboard')
        } catch (error) {
            console.error('Onboarding error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Уншиж байна...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-[#F9F3EF] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {fromRegister ? 'Бүртгэл амжилттай!' : 'Тавтай морил!'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {fromRegister
                            ? 'Google-ээр бүртгэл амжилттай үүслээ. Одоо таны мэдээллийг бөглөе.'
                            : 'Нэвтэрсэн байна. Одоо таны мэдээллийг бөглөе.'
                        }
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                                <span className="text-sky-700 font-semibold text-lg">
                                    {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{session.user?.name || 'Unknown User'}</p>
                                <p className="text-sm text-slate-600">{session.user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Таны мэдээлэл</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Нэр
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={session.user?.name || ''}
                                        className="w-full h-11 rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                                        placeholder="Таны нэр"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Имэйл
                                    </label>
                                    <input
                                        type="email"
                                        value={session.user?.email || ''}
                                        disabled
                                        className="w-full h-11 rounded-xl border border-slate-300 px-3 bg-slate-50 text-slate-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Таны сонирхол
                                </label>
                                <select className="w-full h-11 rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
                                    <option value="">Сонгоно уу</option>
                                    <option value="programming">Програмчлал</option>
                                    <option value="design">Дизайн</option>
                                    <option value="marketing">Маркетинг</option>
                                    <option value="business">Бизнес</option>
                                    <option value="language">Хэл</option>
                                    <option value="other">Бусад</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200">
                            <button
                                onClick={handleCompleteOnboarding}
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    'Боловсруулж байна...'
                                ) : (
                                    <>
                                        Онлайн сургалтад эхлэх
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center text-sm text-slate-600">
                            <Link href="/courses" className="text-sky-700 hover:underline">
                                Одоохондоо алгасах
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Уншиж байна...</p>
                </div>
            </div>
        }>
            <OnboardingContent />
        </Suspense>
    )
}
