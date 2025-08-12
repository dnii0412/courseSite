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
    <div className="mb-4 flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <button
          key={i}
          onClick={() => removeChip(c)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <span>{c.label}</span>
          <span>×</span>
        </button>
      ))}
      <button onClick={() => router.push('/courses')} className="text-sm underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded">
        Цэвэрлэх
      </button>
    </div>
  )
}


