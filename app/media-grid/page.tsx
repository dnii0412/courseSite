"use client"

import { useEffect, useState } from 'react'
import { Footer } from '@/components/layout/footer'
import Navbar from '@/components/Navbar'

type MediaItem = {
  _id: string
  type: 'image' | 'video'
  url: string
  posterUrl?: string
  alt?: string
  width?: number
  height?: number
}

export default function PublicMediaGridPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/media', { cache: 'no-store' })
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || 'Failed to load media')
        setItems(j.data || [])
      } catch (e: any) {
        setError(String(e?.message || e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#F9F3EF]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1B3C53] mb-6">Media</h1>

        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((m) => (
            <div key={m._id} className="relative bg-white border border-[#D2C1B6] rounded-md overflow-hidden">
              {m.type === 'video' ? (
                <video src={m.url} poster={m.posterUrl} className="w-full h-full object-cover" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.alt || ''} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}


