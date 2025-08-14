'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AppliedChips() {
  const params = useSearchParams()
  const router = useRouter()

  const selectedCategories = new Set((params.get('category') || '').split(',').filter(Boolean))
  const selectedLevel = params.get('level') || ''
  const price = params.get('price') || ''
  const duration = params.get('duration') || ''
  const lang = new Set((params.get('language') || '').split(',').filter(Boolean))

  const chips = useMemo(() => {
    const out: { key: string; label: string; value: string }[] = []
    selectedCategories.forEach((c) => out.push({ key: 'category', value: c, label: `Ангилал: ${c}` }))
    if (selectedLevel) out.push({ key: 'level', value: selectedLevel, label: `Түвшин: ${selectedLevel}` })
    if (price) out.push({ key: 'price', value: price, label: price === 'free' ? 'Үнэ: Үнэгүй' : 'Үнэ: Төлбөртэй' })
    if (duration) out.push({ key: 'duration', value: duration, label: 'Үргэлжлэх хугацаа' })
    lang.forEach((l) => out.push({ key: 'language', value: l, label: `Хэл: ${l}` }))
    return out
  }, [selectedCategories, selectedLevel, price, duration, lang])

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

  function removeChip(chip: { key: string; value: string }) {
    if (['category', 'language'].includes(chip.key)) toggleInCsv(chip.key, chip.value)
    else {
      const next = new URLSearchParams(params.toString())
      next.delete(chip.key)
      next.delete('page')
      router.push(`/courses?${next.toString()}`)
    }
  }

  if (!chips.length) return null

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {chips.map((c, i) => (
          <button
            key={i}
            onClick={() => removeChip(c)}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border-2 border-[#D2C1B6] bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#1B3C53] hover:bg-[#F9F3EF] focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2 transition-all duration-200"
          >
            <span className="truncate max-w-[120px] sm:max-w-none">{c.label}</span>
            <span className="text-[#456882] font-bold text-sm sm:text-base flex-shrink-0">×</span>
          </button>
        ))}
      </div>
      {chips.length > 0 && (
        <button 
          onClick={() => router.push('/courses')} 
          className="text-xs sm:text-sm font-medium text-[#456882] hover:text-[#1B3C53] underline focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2 transition-colors duration-200"
        >
          Бүх шүүлтийг цэвэрлэх
        </button>
      )}
    </div>
  )
}


