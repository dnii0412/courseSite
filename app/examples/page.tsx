import { MediaGrid } from '@/components/media/media-grid';
import { Footer } from '@/components/layout/footer';

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-[#F9F3EF]">

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1B3C53] mb-4">
              Media Grid Examples
            </h1>
            <p className="text-gray-600 text-lg">
              Examples of how to use the MediaGrid component in different contexts
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Example 1: Basic Grid
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <MediaGrid />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Example 2: Sidebar Layout
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <MediaGrid />
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
      </main>

      <Footer />
    </div>
  )
}
