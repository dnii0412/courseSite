'use client'

import * as React from 'react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  helperText?: string
}

export function FormField({ id, label, error, helperText, className = '', ...props }: FormFieldProps) {
  const describedBy = [helperText ? `${id}-help` : '', error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy || undefined}
        className={`h-11 w-full rounded-xl border border-slate-300 bg-white px-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 dark:bg-slate-900 dark:border-slate-700 ${className}`}
        {...props}
      />
      {helperText && (
        <p id={`${id}-help`} className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}


