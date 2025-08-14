"use client"

import { Suspense } from 'react'
import { MediaGrid } from '@/components/media/media-grid'

export default function MediaGridPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <MediaGrid />
      </Suspense>
    </div>
  )
}


