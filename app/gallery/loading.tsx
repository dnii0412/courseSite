import { GridSkeleton } from '@/components/ui/grid-skeleton';

export default function GalleryLoading() {
    return (
        <div className="min-h-screen bg-[#F9F3EF]">
            <main className="py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#1B3C53] mb-4">
                        Media Gallery
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Explore our curated media collection in a beautiful grid layout
                    </p>
                </div>

                <GridSkeleton />
            </main>
        </div>
    );
}
