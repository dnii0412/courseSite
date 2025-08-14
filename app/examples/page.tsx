import { MediaGrid } from '@/components/media/media-grid'
import { Suspense } from 'react'

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MediaGrid Component Examples
        </h1>

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Example 1: Basic Grid
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Suspense fallback={<div>Loading...</div>}>
                <MediaGrid />
              </Suspense>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Example 2: Sidebar Layout
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MediaGrid />
                  </Suspense>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sidebar Content</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-100 rounded border border-gray-200">
                      <p className="text-sm text-gray-600">Sidebar item 1</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded border border-gray-200">
                      <p className="text-sm text-gray-600">Sidebar item 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
