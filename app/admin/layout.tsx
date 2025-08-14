'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Menu } from 'lucide-react'

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()
    const isLogin = pathname === '/admin/login'
    const { isAdmin, isLoading } = useAdminAuth()
    const router = useRouter()

    // Redirect non-admin users
    useEffect(() => {
        if (isLoading) return // Still loading
        
        if (!isAdmin && !isLogin) {
            // Not admin, redirect to login
            router.push('/admin/login')
        }
    }, [isAdmin, isLoading, isLogin, router])

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // If not admin and not on login page, don't render anything
    if (!isAdmin && !isLogin) {
        return null
    }

	return (
        <div className="min-h-screen bg-white">
			<div className="flex">
				{/* Desktop Sidebar */}
				{!isLogin ? (
                    <aside className={`hidden md:block sticky top-0 h-screen border-r border-gray-200 bg-white`}>
                        <AdminSidebar collapsed={collapsed} />
                    </aside>
				) : null}

				{/* Content */}
				<div className="flex-1 min-w-0">
					{/* Mobile menu button */}
					{!isLogin ? (
					<div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 flex items-center justify-between">
						<button
							aria-label="Цэс нээх"
                            className="p-2 rounded-lg border border-gray-200"
							onClick={() => setMobileOpen(true)}
						>
							<Menu className="w-5 h-5" />
						</button>
						<div className="text-sm font-medium text-black">Админ</div>
					</div>
					) : null}

                    <div className="px-4 md:px-8 py-6">
						{children}
					</div>
				</div>
			</div>

			{/* Mobile Drawer */}
			{mobileOpen && !isLogin && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl border-r border-gray-200">
						<AdminSidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
					</div>
				</div>
			)}
		</div>
	)
}


