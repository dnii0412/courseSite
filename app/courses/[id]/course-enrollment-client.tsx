"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, UserPlus, Play } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/useAuth"
import { PaymentModal } from "@/components/payment-modal"
import type { Course } from "@/lib/types"

interface CourseEnrollmentClientProps {
    course: Course
}

export function CourseEnrollmentClient({ course }: CourseEnrollmentClientProps) {
    const { user, loading: authLoading, refreshUser } = useAuth()
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    // Refresh user data when component mounts (in case admin granted access)
    useEffect(() => {
        if (!authLoading) {
            refreshUser()
        }
    }, [authLoading])

    // Check enrollment status
    const isLoggedIn = !!user
    const isEnrolled = course && user?.enrolledCourses?.includes(course._id || '')

    // Determine what button to show
    const getEnrollmentButton = () => {
        if (!isLoggedIn) {
            return (
                <div className="space-y-3">
                    <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link href="/register">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Бүртгүүлэх
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/login">
                            Нэвтрэх
                        </Link>
                    </Button>
                </div>
            )
        }

        if (isEnrolled) {
            return (
                <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-green-600 dark:text-green-400 font-medium mb-2">
                            ✅ Та энэ хичээлд элссэн байна
                        </div>
                        <p className="text-sm text-green-600/80 dark:text-green-400/80">
                            Хичээлээ үргэлжлүүлэхийн тулд доорх товчийг дарна уу
                        </p>
                    </div>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <Link href={`/courses/${course._id}/learn`}>
                            <Play className="w-4 h-4 mr-2" />
                            Хичээл үзэх
                        </Link>
                    </Button>
                </div>
            )
        }

        return (
            <div className="space-y-3">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-red-600 dark:text-red-400 font-medium mb-2">
                        🛒 Худалдаж авах шаардлагатай
                    </div>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80">
                        Энэ хичээлийг үзэхийн тулд худалдаж авна уу
                    </p>
                </div>
                <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => setShowPaymentModal(true)}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    ₮{course?.price?.toLocaleString() || "0"} -өөр худалдаж авах
                </Button>
            </div>
        )
    }

    if (authLoading) {
        return (
            <div className="space-y-3">
                <div className="w-full h-12 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-12 bg-muted animate-pulse rounded"></div>
            </div>
        )
    }

    return (
        <>
            {getEnrollmentButton()}
            {showPaymentModal && (
                <PaymentModal
                    course={course}
                    onClose={() => {
                        setShowPaymentModal(false)
                        refreshUser() // Refresh user data after payment modal closes
                    }}
                />
            )}
        </>
    )
}
