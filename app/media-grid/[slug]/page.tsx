import { MediaGrid } from '@/components/media/media-grid';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface MediaGridPageProps {
  params: {
    slug: string;
  };
}

export default function MediaGridPage({ params }: MediaGridPageProps) {
  return (
    <div className="min-h-screen bg-[#F9F3EF]">
      <Navbar />
      
      <main className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1B3C53] mb-4">
            Media Grid: {params.slug}
          </h1>
          <p className="text-gray-600">
            Responsive media layout
          </p>
        </div>
        
        <MediaGrid slug={params.slug} />
      </main>
      
      <Footer />
    </div>
  );
}
