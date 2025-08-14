import { MediaGrid } from '@/components/media/media-grid';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              MediaGrid Component Examples
            </h1>
            <p className="text-gray-600 text-lg">
              Examples of how to use the MediaGrid component in different contexts
            </p>
          </div>

          {/* Example 1: Full-width media grid */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Example 1: Basic Grid
              </h2>
              <p className="text-gray-600">
                A standalone media grid that takes the full width of the page
              </p>
            </div>

            <div className="h-[90vh]">
              <MediaGrid slug="home-hero" />
            </div>
          </section>

          {/* Example 2: Sidebar layout with media grid */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Example 2: Sidebar Layout
              </h2>
              <p className="text-gray-600">
                Media grid integrated into a sidebar layout
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sidebar Content</h3>
                  <p className="text-gray-600 mb-4">
                    This shows how the MediaGrid can be integrated into different layouts.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-100 rounded border border-gray-200">
                      Navigation Item 1
                    </div>
                    <div className="p-3 bg-gray-100 rounded border border-gray-200">
                      Navigation Item 2
                    </div>
                    <div className="p-3 bg-gray-100 rounded border border-gray-200">
                      Navigation Item 3
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content with media grid */}
              <div className="lg:col-span-3">
                <div className="h-[70vh]">
                  <MediaGrid slug="home-hero" />
                </div>
              </div>
            </div>
          </section>

          {/* Example 3: Card-based layout */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Example 3: Card Layout
              </h2>
              <p className="text-gray-600">
                Media grid wrapped in a card container
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 text-white p-6">
                  <h3 className="text-xl font-semibold">Featured Content</h3>
                  <p className="text-gray-200">Showcase your media in a beautiful card</p>
                </div>

                <div className="p-6">
                  <div className="h-[60vh]">
                    <MediaGrid slug="home-hero" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Example 4: Responsive grid layout */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Example 4: Responsive Grid Layout
              </h2>
              <p className="text-gray-600">
                Multiple media grids in a responsive grid layout
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grid 1</h3>
                <div className="h-[40vh]">
                  <MediaGrid slug="home-hero" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grid 2</h3>
                <div className="h-[40vh]">
                  <MediaGrid slug="home-hero" />
                </div>
              </div>
            </div>
          </section>

          {/* Usage Instructions */}
          <section className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use MediaGrid Component</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Usage</h3>
                <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                  {`import { MediaGrid } from '@/components/media/media-grid';

<MediaGrid slug="your-layout-slug" />`}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">With Custom Styling</h3>
                <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                  {`<div className="h-[90vh] max-w-7xl mx-auto">
  <MediaGrid slug="home-hero" />
</div>`}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Layouts</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">home-hero</code> - Main homepage layout</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">about-section</code> - About page layout</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">gallery</code> - Photo gallery layout</li>
                <li>• Create custom layouts in the admin panel</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
