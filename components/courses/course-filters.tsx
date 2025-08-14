'use client'

import { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CourseFiltersProps {
  searchQuery: string
  category: string
  level: string
  price: string
  duration: string
  language: string
  sort: string
  onFiltersChange: (filters: Record<string, string>) => void
  onClearFilters: () => void
}

const categories = [
  { value: 'technology', label: 'Технологи' },
  { value: 'business', label: 'Бизнес' },
  { value: 'design', label: 'Дизайн' },
  { value: 'marketing', label: 'Маркетинг' },
  { value: 'other', label: 'Бусад' }
]

const levels = [
  { value: 'beginner', label: 'Эхлэгч' },
  { value: 'intermediate', label: 'Дунд' },
  { value: 'advanced', label: 'Дээд' }
]

const priceRanges = [
  { value: 'free', label: 'Үнэгүй' },
  { value: 'paid', label: 'Төлбөртэй' }
]

const durations = [
  { value: '0-2', label: '0-2 цаг' },
  { value: '2-5', label: '2-5 цаг' },
  { value: '5-10', label: '5-10 цаг' },
  { value: '10+', label: '10+ цаг' }
]

const languages = [
  { value: 'mn', label: 'Монгол' },
  { value: 'en', label: 'Англи' },
  { value: 'both', label: 'Хоёуланд' }
]

const sortOptions = [
  { value: 'newest', label: 'Шинээс нь' },
  { value: 'oldest', label: 'Хуучинаас нь' },
  { value: 'price-low', label: 'Үнэ багаас' },
  { value: 'price-high', label: 'Үнэ ихээс' },
  { value: 'rating', label: 'Үнэлгээ' },
  { value: 'popular', label: 'Түгээмэл' }
]

export function CourseFilters({
  searchQuery,
  category,
  level,
  price,
  duration,
  language,
  sort,
  onFiltersChange,
  onClearFilters
}: CourseFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    searchQuery,
    category,
    level,
    price,
    duration,
    language,
    sort
  })

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '')

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setLocalFilters({
      searchQuery: '',
      category: '',
      level: '',
      price: '',
      duration: '',
      language: '',
      sort: ''
    })
    onClearFilters()
  }

  const activeFiltersCount = Object.values(localFilters).filter(value => value !== '').length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Хичээл хайх…"
          value={localFilters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          variant="outline"
          className="flex items-center gap-2 border-slate-300 hover:border-slate-400"
        >
          <Filter className="w-4 h-4" />
          Хайлалт ба шүүлт
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>

        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900"
          >
            <X className="w-4 h-4 mr-1" />
            Цэвэрлэх
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Ангилал
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            >
              <option value="">Бүгд</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Түвшин
            </label>
            <select
              value={localFilters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            >
              <option value="">Бүгд</option>
              {levels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Үнэ
            </label>
            <select
              value={localFilters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            >
              <option value="">Бүгд</option>
              {priceRanges.map((prc) => (
                <option key={prc.value} value={prc.value}>
                  {prc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Үргэлжлэх хугацаа
            </label>
            <select
              value={localFilters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            >
              <option value="">Бүгд</option>
              {durations.map((dur) => (
                <option key={dur.value} value={dur.value}>
                  {dur.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Хэл
            </label>
            <select
              value={localFilters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            >
              <option value="">Бүгд</option>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Эрэмбэ
            </label>
            <select
              value={localFilters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            >
              <option value="">Үндсэн</option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
