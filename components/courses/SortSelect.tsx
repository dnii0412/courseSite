'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const options = [
  { value: 'new', label: 'Шинэ' },
  { value: 'views', label: 'Их үзэлттэй' },
  { value: 'rating', label: 'Үнэлгээ өндөр' },
  { value: 'price_asc', label: 'Үнэ багаас их' },
  { value: 'price_desc', label: 'Үнэ ихээс бага' },
]

export function SortSelect() {
  const params = useSearchParams()
  const router = useRouter()
  const value = params.get('sort') || 'new'
  function onChange(v: string) {
    const next = new URLSearchParams(params.toString())
    next.set('sort', v)
    next.delete('page')
    router.push(`/courses?${next.toString()}`)
  }
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
