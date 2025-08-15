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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 sm:h-12 w-full rounded-xl border-2 border-[#D2C1B6] bg-white px-3 sm:px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 text-[#1B3C53] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[right_12px_center] bg-no-repeat"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-[#1B3C53]">{o.label}</option>
        ))}
      </select>
    </div>
  )
}
