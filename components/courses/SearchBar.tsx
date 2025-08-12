'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchBar() {
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
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      />
      <button onClick={submit} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 px-3 rounded-lg bg-slate-900 text-white text-sm">
        Хайх
      </button>
    </div>
  )
}


