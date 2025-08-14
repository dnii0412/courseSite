'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const options = [
  { value: 'new', label: 'Шинэ' },
  { value: 'views', label: 'Их үзэлттэй' },
  { value: 'rating', label: 'Үнэлгээ өндөр' },
  { value: 'price_asc', label: 'Үнэ багаас их' },
  { value: 'price_desc', label: 'Үнэ ихээс бага' },
]

export default function SortSelect() {
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
      className="h-9 sm:h-10 lg:h-11 rounded-xl border-2 border-[#D2C1B6] bg-white px-3 sm:px-4 text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 text-[#1B3C53]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="text-[#1B3C53]">{o.label}</option>
      ))}
    </select>
  )
}


