'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = ['technology', 'business', 'design', 'marketing', 'other']
const levels = [
  { value: 'beginner', label: 'Эхлэгч' },
  { value: 'intermediate', label: 'Дунд' },
  { value: 'advanced', label: 'Ахисан' },
]

export default function Filters() {
  const params = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const closeSidebar = () => {
    setOpen(false)
  }

  // Debug logging
  console.log('Filters component - open state:', open)

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
    if (selectedLevel) out.push({ key: 'level', value: selectedLevel, label: `Түвшин: ${levels.find(l => l.value===selectedLevel)?.label || selectedLevel}` })
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
      {/* Mobile trigger and sort selector in one line */}
      <div className="lg:hidden mb-4">
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={() => {
              console.log('Filter button clicked, setting open to true')
              setOpen(true)
            }} 
            className="flex-1 h-10 sm:h-12 rounded-xl border-2 border-[#456882] bg-[#456882] text-white text-xs sm:text-sm font-medium shadow-md hover:bg-[#1B3C53] hover:border-[#1B3C53] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2"
          >
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span className="hidden sm:inline">Шүүлт</span>
              <span className="sm:hidden">Шүүлт</span>
            </div>
          </button>
          
          <div className="w-28 sm:w-32">
            <select 
              value={params.get('sort') || 'new'}
              onChange={(e) => {
                const next = new URLSearchParams(params.toString())
                next.set('sort', e.target.value)
                next.delete('page')
                router.push(`/courses?${next.toString()}`)
              }}
              className="h-10 sm:h-12 w-full rounded-xl border-2 border-[#D2C1B6] bg-white pl-2 sm:pl-3 pr-6 sm:pr-8 text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 text-[#1B3C53] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22/%3E%3C/svg%3E')] bg-[length:10px_10px] sm:bg-[length:12px_12px] bg-[right_6px_center] sm:bg-[right_8px_center] bg-no-repeat"
            >
              <option value="new">Шинэ</option>
              <option value="views">Их үзэлттэй</option>
              <option value="rating">Үнэлгээ өндөр</option>
              <option value="price_asc">Үнэ багаас их</option>
              <option value="price_desc">Үнэ ихээс бага</option>]
            </select>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeSidebar}
          />
          
          {/* Drawer */}
          <div 
            className="absolute bottom-0 left-2 right-2 h-[65vh] max-h-[450px] bg-white shadow-2xl rounded-t-2xl z-[70]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Drag indicator */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-[#1B3C53]">Шүүлт</h3>
                <button 
                  onClick={() => setOpen(false)} 
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Хаах"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="space-y-4 sm:space-y-5">
                {/* Categories Section */}
                <section className="bg-gray-50 rounded-xl p-2.5 sm:p-3">
                  <h4 className="font-semibold mb-2.5 sm:mb-3 text-[#1B3C53] text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#456882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Категори
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-lg transition-colors duration-200">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.has(c)} 
                          onChange={() => toggleInCsv('category', c)}
                          className="w-4 h-4 text-[#456882] border-gray-300 rounded focus:ring-[#456882] focus:ring-2"
                        /> 
                        <span className="capitalize font-medium text-[#1B3C53]">{c}</span>
                      </label>
                    ))}
                  </div>
                </section>
                
                {/* Level Section */}
                <section className="bg-gray-50 rounded-xl p-2.5 sm:p-3">
                  <h4 className="font-semibold mb-2.5 sm:mb-3 text-[#1B3C53] text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#456882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Түвшин
                  </h4>
                  <div className="space-y-2">
                    {levels.map((l) => (
                      <label key={l.value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-lg transition-colors duration-200">
                        <input 
                          type="radio" 
                          name="m_level" 
                          checked={selectedLevel === l.value} 
                          onChange={() => setQuery('level', l.value)}
                          className="w-4 h-4 text-[#456882] border-gray-300 focus:ring-[#456882] focus:ring-2"
                        /> 
                        <span className="font-medium text-[#1B3C53]">{l.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
                
                {/* Price Section */}
                <section className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold mb-3 sm:mb-4 text-[#1B3C53] text-sm sm:text-base flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#456882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Үнэ
                  </h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button 
                      onClick={() => setQuery('price', price === 'free' ? undefined : 'free')} 
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2 ${
                        price === 'free' 
                          ? 'bg-[#456882] text-white border-[#456882] shadow-md' 
                          : 'border-gray-300 text-gray-700 hover:border-[#456882] hover:text-[#456882] hover:bg-gray-50'
                      }`}
                    >
                      Үнэгүй
                    </button>
                    <button 
                      onClick={() => setQuery('price', price === 'paid' ? undefined : 'paid')} 
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2 ${
                        price === 'paid' 
                          ? 'bg-[#456882] text-white border-[#456882] shadow-md' 
                          : 'border-gray-300 text-gray-700 hover:border-[#456882] hover:text-[#456882] hover:bg-gray-50'
                      }`}
                    >
                      Төлбөртэй
                    </button>
                  </div>
                </section>
                
                {/* Duration Section */}
                <section className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold mb-3 sm:mb-4 text-[#1B3C53] text-sm sm:text-base flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#456882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Үргэлжлэх хугацаа
                  </h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[
                      { v: 'lt1', l: '<1ц' },
                      { v: '1_3', l: '1–3ц' },
                      { v: '3_10', l: '3–10ц' },
                      { v: '10p', l: '10ц+' },
                    ].map((d) => (
                      <button 
                        key={d.v} 
                        onClick={() => setQuery('duration', duration === d.v ? undefined : d.v)} 
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2 ${
                          duration === d.v 
                            ? 'bg-[#456882] text-white border-[#456882] shadow-md' 
                            : 'border-gray-300 text-gray-700 hover:border-[#456882] hover:text-[#456882] hover:bg-gray-50'
                        }`}
                      >
                        {d.l}
                      </button>
                    ))}
                  </div>
                </section>
                
                {/* Language Section */}
                <section className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold mb-3 sm:mb-4 text-[#1B3C53] text-sm sm:text-base flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#456882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Хэл
                  </h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {['mn', 'en'].map((l) => (
                      <label key={l} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm cursor-pointer hover:bg-white p-2 sm:p-3 rounded-lg transition-colors duration-200">
                        <input 
                          type="checkbox" 
                          checked={lang.has(l)} 
                          onChange={() => toggleInCsv('language', l)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#456882] border-gray-300 rounded focus:ring-[#456882] focus:ring-2"
                        /> 
                        <span className="font-medium text-[#1B3C53]">{l.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>
              
              {/* Footer */}
              <div className="p-3 border-t border-gray-200">
                <button 
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 px-3 bg-[#456882] text-white rounded-lg text-sm font-medium hover:bg-[#1B3C53] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2"
                >
                  Хайлт хийх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

        {/* Grid placeholder slot rendered by page */}
        <div className="min-h-[200px]" />
      </div>
    </>
  )
}




