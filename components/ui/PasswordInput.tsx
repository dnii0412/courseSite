'use client'

import * as React from 'react'

type Strength = 0 | 1 | 2 | 3 | 4

function scoreToLabel(score: Strength): string {
  return ['Маш сул', 'Сул', 'Дунд', 'Хүчтэй', 'Маш хүчтэй'][score]
}

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  strength: Strength
  error?: string
  show?: boolean
  onToggleShow?: () => void
}

export function PasswordInput({ id, value, onChange, strength, error, show, onToggleShow, ...props }: PasswordInputProps) {
  const [internalShow, setInternalShow] = React.useState(false)
  const isControlled = typeof show === 'boolean'
  const visible = isControlled ? (show as boolean) : internalShow
  const bars = [0, 1, 2, 3]
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={`${id}-strength ${error ? `${id}-error` : ''}`.trim() || undefined}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-12 shadow-sm placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 dark:bg-slate-900 dark:border-slate-700"
          {...props}
        />
        <button
          type="button"
          onClick={() => (onToggleShow ? onToggleShow() : setInternalShow((v) => !v))}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded"
          aria-label={visible ? 'Нуух' : 'Харах'}
        >
          {visible ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.46-1.07 1.12-2.05 1.94-2.94" />
              <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {/* Strength meter */}
      <div className="flex items-center gap-2" id={`${id}-strength`}>
        <div className="flex gap-1">
          {bars.map((i) => (
            <div
              key={i}
              className={`h-1.5 w-16 rounded-full ${i <= strength - 1 ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-300">{scoreToLabel(strength)}</span>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}


