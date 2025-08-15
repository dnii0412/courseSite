"use client"

import { useState, useEffect } from 'react'
import { MediaGrid } from '@/components/media/media-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, Play, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'

interface GridFeatureSectionProps {
    title?: string
    description?: string
    showAdminLink?: boolean
}

export function GridFeatureSection({
    title = "Онцлог контент",
    description = "Манай сонгосон онцлог контент",
    showAdminLink = true
}: GridFeatureSectionProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasContent, setHasContent] = useState(false)

    useEffect(() => {
        // Check if there's content available
        const checkContent = async () => {
            try {
                const response = await fetch('/api/layouts/home-hero')
                if (response.ok) {
                    const data = await response.json()
                    setHasContent(data.layout && data.layout.items && data.layout.items.length > 0)
                }
            } catch (error) {
                // No grid content available
            } finally {
                setIsLoading(false)
            }
        }

        checkContent()
    }, [])

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Контент уншиж байна...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (!hasContent) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {title}
                            </h2>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                {description}
                            </p>
                            {showAdminLink && (
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Link href="/admin/media-grid">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Админ удирдлага
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/media-grid">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Grid тохиргоо
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Media Grid */}
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <MediaGrid slug="home-hero" />
                    </div>
                </div>


            </div>
        </section>
    )
}
