'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo } from 'react'
import { ChevronRight, MoreHorizontal, Search } from 'lucide-react'

const SectionLink = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
    <span>{label}</span>
    <ChevronRight className="w-3 h-3" />
  </div>
)

export default function AdminDashboard() {
  const customers = useMemo(
    () => [
      { name: 'Chris Friedkly', company: 'Supermarket Villanova' },
      { name: 'Maggie Johnson', company: 'Oasis Organic Inc.' },
      { name: 'Gael Harry', company: 'New York Finest Fruits' },
      { name: 'Jenna Sullivan', company: 'Walmart' }
    ],
    []
  )

  const topStates = useMemo(
    () => [
      { code: 'NY', value: 120 },
      { code: 'MA', value: 80 },
      { code: 'NH', value: 70 },
      { code: 'OR', value: 50 }
    ],
    []
  )

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-sm text-gray-700">Revenues</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-4xl font-semibold text-[#1B3C53]">15%</div>
            <div className="mt-2 text-xs text-gray-600">Increase compared to last week</div>
            <div className="mt-4">
              <SectionLink label="Revenues report" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-sm text-gray-700">Lost deals</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-4xl font-semibold text-[#1B3C53]">4%</div>
            <div className="mt-2 text-xs text-gray-600">You closed 96 out of 100 deals</div>
            <div className="mt-4">
              <SectionLink label="All deals" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="p-5">
            <CardTitle className="text-sm text-gray-700">Customers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul>
              {customers.map((c, idx) => (
                <li
                  key={c.name}
                  className={`flex items-center justify-between px-5 py-3 ${idx === 1 ? 'bg-[#FFF8F3]' : ''} border-t first:border-t-0`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200">
                      <Image src="/placeholder-user.jpg" alt="" width={36} height={36} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                      <div className="text-xs text-gray-500 truncate">{c.company}</div>
                    </div>
                  </div>
                  <button className="p-1 text-gray-500 hover:text-gray-800">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 grid gap-6">
        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-sm text-gray-700">Quarter goal</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex items-center justify-center py-2">
              <svg width="140" height="90" viewBox="0 0 140 90">
                <path d="M10 80 A60 60 0 1 1 130 80" fill="none" stroke="#F1E7E0" strokeWidth="14" />
                <path d="M10 80 A60 60 0 1 1 118 32" fill="none" stroke="#1B3C53" strokeWidth="14" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center text-3xl font-semibold text-[#1B3C53]">84%</div>
            <div className="mt-3 flex justify-center">
              <SectionLink label="All goals" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-sm text-gray-700">Chats</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-xs text-gray-600 mb-3">2 unread messages</div>
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                  <Image src="/placeholder-user.jpg" alt="" width={32} height={32} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5">
            <CardTitle className="text-sm text-gray-700">Top states</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <ul className="space-y-3">
              {topStates.map((s) => (
                <li key={s.code} className="flex items-center gap-3">
                  <span className="text-xs w-10 text-gray-700">{s.code}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-[#1B3C53]"
                      style={{ width: `${s.value / 1.2}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-10 text-right">{s.value}k</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-gray-700">Growth</CardTitle>
            <div className="text-xs text-gray-500">Yearly</div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="h-56">
            <svg width="100%" height="100%" viewBox="0 0 700 220">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1B3C53" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1B3C53" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path d="M20 180 C 100 150, 140 80, 220 120 S 380 60, 460 180 620 80, 680 160 L 680 200 20 200 Z" fill="url(#g)" />
              <path d="M20 180 C 100 150, 140 80, 220 120 S 380 60, 460 180 620 80, 680 160" fill="none" stroke="#1B3C53" strokeWidth="2" />
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:col-span-1 md:grid-cols-3 lg:grid-cols-1">
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm text-gray-700">Top month</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-sm">
            <div className="font-medium text-[#1B3C53]">November</div>
            <div className="text-xs text-gray-500">2019</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm text-gray-700">Top year</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-sm">
            <div className="font-medium text-[#1B3C53]">2023</div>
            <div className="text-xs text-gray-500">96k sold so far</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm text-gray-700">Top buyer</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                <Image src="/placeholder-user.jpg" alt="" width={32} height={32} />
              </div>
              <div>
                <div className="font-medium text-gray-900">Maggie Johnson</div>
                <div className="text-xs text-gray-500">Oasis Organic Inc.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-3">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-gray-700">New deals</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="pl-7 pr-3 py-2 text-sm rounded-md border bg-white outline-none focus:ring-2 focus:ring-[#1B3C53]/20"
                placeholder="Search deals"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="flex flex-wrap gap-2">
            {['Fruit2Go','Marshall\'s MKT','CCNT','Joana Mini-market','Little Brazil Vegan','Target','Organic Place'].map((x) => (
              <span key={x} className="inline-flex items-center gap-2 rounded-full bg-[#F9F3EF] text-[#1B3C53] text-xs py-2 px-3 border">
                {x}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


