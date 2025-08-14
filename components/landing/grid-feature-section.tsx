"use client"

import { MediaGrid } from '@/components/media/media-grid'

export function GridFeatureSection({ slug }: { slug?: string } = {}) {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1B3C53]">Таны дурын хөтөлбөрийн самбар</h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <MediaGrid slug={slug || 'home-hero'} />
        </div>
      </div>
    </section>
  )
}
