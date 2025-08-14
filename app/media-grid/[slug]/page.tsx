import { MediaGrid } from '@/components/media/media-grid'
import { Suspense } from 'react'

export default function MediaGridBySlugPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Media Grid
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <MediaGrid slug={params.slug} />
        </Suspense>
      </div>
    </div>
  )
}
