'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = ['technology', 'business', 'design', 'marketing', 'other']
const levels = [
  { value: 'beginner', label: 'Эхлэгч' },
  { value: 'intermediate', label: 'Дунд' },
  { value: 'advanced', label: 'Ахисан' },
]

export function Filters() {
  const params = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const selectedCategories = new Set((params.get('category') || '').split(',').filter(Boolean))
  const selectedLevel = params.get('level') || ''
  const price = params.get('price') || '' // free|paid
  const duration = params.get('duration') || '' // lt1|1_3|3_10|10p
  const lang = new Set((params.get('language') || '').split(',').filter(Boolean))

  function setQuery(key: string, value?: string) {
    const next = new URLSearchParams(params.toString())
    if (!value) next.delete(key)
    else next.set(key, value)
    next.delete('page')
    router.push(`/courses?${next.toString()}`)
  }

  function toggleInCsv(key: string, v: string) {
    const next = new URLSearchParams(params.toString())
    const set = new Set((params.get(key) || '').split(',').filter(Boolean))
    if (set.has(v)) set.delete(v)
    else set.add(v)
    if (set.size) next.set(key, Array.from(set).join(','))
    else next.delete(key)
    next.delete('page')
    router.push(`/courses?${next.toString()}`)
  }

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  const chips = useMemo(() => {
    const out: { key: string; label: string; value: string }[] = []
    selectedCategories.forEach((c) => out.push({ key: 'category', value: c, label: `Ангилал: ${c}` }))
    if (selectedLevel) out.push({ key: 'level', value: selectedLevel, label: `Түвшин: ${levels.find(l => l.value === selectedLevel)?.label || selectedLevel}` })
    if (price) out.push({ key: 'price', value: price, label: price === 'free' ? 'Үнэ: Үнэгүй' : 'Үнэ: Төлбөртэй' })
    if (duration) out.push({ key: 'duration', value: duration, label: 'Үргэлжлэх хугацаа' })
    lang.forEach((l) => out.push({ key: 'language', value: l, label: `Хэл: ${l}` }))
    return out
  }, [selectedCategories, selectedLevel, price, duration, lang])

  const removeChip = (chip: { key: string; value: string }) => {
    if (['cat', 'lang'].includes(chip.key)) toggleInCsv(chip.key, chip.value)
    else setQuery(chip.key, undefined)
  }

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setOpen(true)} className="h-11 w-full rounded-xl border border-slate-300 bg-white">Хайлалт ба шүүлт</button>
      </div>

      {/* Applied chips moved to top-level (AppliedChips) */}

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-24 self-start">
          <div className="space-y-6">
            <section>
              <h4 className="font-medium mb-2">Категори</h4>
              <div className="space-y-1">
                {categories.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedCategories.has(c)} onChange={() => toggleInCsv('category', c)} /> {c}
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h4 className="font-medium mb-2">Түвшин</h4>
              <div className="space-y-1">
                {levels.map((l) => (
                  <label key={l.value} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="level" checked={selectedLevel === l.value} onChange={() => setQuery('level', l.value)} /> {l.label}
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h4 className="font-medium mb-2">Үнэ</h4>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setQuery('price', price === 'free' ? undefined : 'free')} className={`px-3 py-1 rounded-full border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${price === 'free' ? 'bg-slate-900 text-white' : 'border-slate-300'}`}>Үнэгүй</button>
                <button onClick={() => setQuery('price', price === 'paid' ? undefined : 'paid')} className={`px-3 py-1 rounded-full border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${price === 'paid' ? 'bg-slate-900 text-white' : 'border-slate-300'}`}>Төлбөртэй</button>
              </div>
            </section>
            <section>
              <h4 className="font-medium mb-2">Үргэлжлэх хугацаа</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                {[
                  { v: 'lt1', l: '<1ц' },
                  { v: '1_3', l: '1–3ц' },
                  { v: '3_10', l: '3–10ц' },
                  { v: '10p', l: '10ц+' },
                ].map((d) => (
                  <button key={d.v} onClick={() => setQuery('duration', duration === d.v ? undefined : d.v)} className={`px-3 py-1 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${duration === d.v ? 'bg-slate-900 text-white' : 'border-slate-300'}`}>{d.l}</button>
                ))}
              </div>
            </section>
            <section>
              <h4 className="font-medium mb-2">Хэл</h4>
              <div className="space-y-1">
                {['mn', 'en'].map((l) => (
                  <label key={l} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={lang.has(l)} onChange={() => toggleInCsv('language', l)} /> {l.toUpperCase()}
                  </label>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Шүүлт</h3>
                <button onClick={() => setOpen(false)} aria-label="Хаах">✕</button>
              </div>
              {/* reuse same controls */}
              <div className="space-y-6">
                <section>
                  <h4 className="font-medium mb-2">Категори</h4>
                  <div className="space-y-1">
                    {categories.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selectedCategories.has(c)} onChange={() => toggleInCsv('category', c)} /> {c}
                      </label>
                    ))}
                  </div>
                </section>
                <section>
                  <h4 className="font-medium mb-2">Түвшин</h4>
                  <div className="space-y-1">
                    {levels.map((l) => (
                      <label key={l.value} className="flex items-center gap-2 text-sm">
                        <input type="radio" name="m_level" checked={selectedLevel === l.value} onChange={() => setQuery('level', l.value)} /> {l.label}
                      </label>
                    ))}
                  </div>
                </section>
                <section>
                  <h4 className="font-medium mb-2">Үнэ</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setQuery('price', price === 'free' ? undefined : 'free')} className={`px-3 py-1 rounded-full border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${price === 'free' ? 'bg-slate-900 text-white' : 'border-slate-300'}`}>Үнэгүй</button>
                    <button onClick={() => setQuery('price', price === 'paid' ? undefined : 'paid')} className={`px-3 py-1 rounded-full border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${price === 'paid' ? 'bg-slate-900 text-white' : 'border-slate-300'}`}>Төлбөртэй</button>
                  </div>
                </section>
                <section>
                  <h4 className="font-medium mb-2">Үргэлжлэх хугацаа</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {[
                      { v: 'lt1', l: '<1ц' },
                      { v: '1_3', l: '1–3ц' },
                      { v: '3_10', l: '3–10ц' },
                      { v: '10p', l: '10ц+' },
                    ].map((d) => (
                      <button key={d.v} onClick={() => setQuery('duration', duration === d.v ? undefined : d.v)} className={`px-3 py-1 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${duration === d.v ? 'bg-slate-900 text-white' : 'border-slate-300'}`}>{d.l}</button>
                    ))}
                  </div>
                </section>
                <section>
                  <h4 className="font-medium mb-2">Хэл</h4>
                  <div className="space-y-1">
                    {['mn', 'en'].map((l) => (
                      <label key={l} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={lang.has(l)} onChange={() => toggleInCsv('language', l)} /> {l.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Grid placeholder slot rendered by page */}
        <div className="min-h-[200px]" />
      </div>
    </>
  )
}
