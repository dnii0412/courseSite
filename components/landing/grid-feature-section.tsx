import { IMedia } from '@/lib/models/media'
import { ILayout } from '@/lib/models/layout'

async function fetchLayout(slug: string): Promise<ILayout | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/layouts?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      // Let the route serve published only for public
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as ILayout
  } catch {
    return null
  }
}

async function fetchMedia(): Promise<IMedia[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/media`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data || []) as IMedia[]
  } catch {
    return []
  }
}

export async function GridFeatureSection() {
  const slug = 'home-hero'
  const [layout, allMedia] = await Promise.all([fetchLayout(slug), fetchMedia()])
  const mediaById = new Map(allMedia.map((m) => [String(m._id), m]))

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1B3C53]">Таны дурын хөтөлбөрийн самбар</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-6 grid-rows-4 gap-1">
            {layout?.published && layout.items.length > 0 ? (
              layout.items.map((item) => {
                const m = mediaById.get(String(item.mediaId))
                if (!m) return null
                return (
                  <div
                    key={item.id}
                    className="relative rounded-md overflow-hidden border border-[#D2C1B6]/50 shadow-sm"
                    style={{
                      gridColumn: `${item.startCol} / span ${item.colSpan}`,
                      gridRow: `${item.startRow} / span ${item.rowSpan}`,
                    }}
                  >
                    {m.type === 'image' ? (
                      <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} poster={m.posterUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    )}
                  </div>
                )
              })
            ) : (
              Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="aspect-square rounded-md border bg-[#F9F3EF] border-[#D2C1B6]/50" />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
