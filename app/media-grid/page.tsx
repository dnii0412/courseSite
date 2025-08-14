"use client"

import { MediaGrid } from '@/components/media/media-grid'
import { Suspense } from 'react'

export default function MediaGridPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Media</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <MediaGrid />
        </Suspense>
      </div>
    </div>
  )
}


