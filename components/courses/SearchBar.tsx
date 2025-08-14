'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SearchBar() {
  const params = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(params.get('q') || '')

  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])

  function submit() {
    const next = new URLSearchParams(params.toString())
    if (q) next.set('q', q)
    else next.delete('q')
    next.delete('page')
    router.push(`/courses?${next.toString()}`)
  }

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Хичээл хайх…"
        className="h-10 sm:h-12 w-full rounded-xl border-2 border-[#D2C1B6] bg-white px-3 sm:px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 text-sm sm:text-base"
      />
      <button 
        onClick={submit} 
        className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-7 sm:h-8 px-3 sm:px-4 rounded-lg bg-[#456882] text-white text-xs sm:text-sm font-medium hover:bg-[#1B3C53] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#456882] focus:ring-offset-2"
      >
        Хайх
      </button>
    </div>
  )
}
