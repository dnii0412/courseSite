'use client'

import * as React from 'react'

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider?: 'google'
}

export function SocialButton({ provider = 'google', className = '', children, ...props }: SocialButtonProps) {
  const content = children || (
    <div className="flex items-center justify-center gap-2">
      {/* Google logo */}
      <svg className="h-5 w-5" viewBox="0 0 533.5 544.3"><path d="M533.5 278.4c0-18.5-1.7-36.3-5-53.6H272v101.5h146.9c-6.3 33.9-25.3 62.7-54 81.9v67h87.1c51.1-47.1 81.5-116.6 81.5-196.8z" fill="#4285F4"/><path d="M272 544.3c73.7 0 135.6-24.3 180.8-66.1l-87.1-67c-24.2 16.2-55.1 25.6-93.7 25.6-71.9 0-132.8-48.6-154.6-113.9H27.6v71.7C72.6 489.9 166.7 544.3 272 544.3z" fill="#34A853"/><path d="M117.4 322.9c-10.6-31.9-10.6-66.5 0-98.4V152.8H27.6c-40.8 81.6-40.8 178 0 259.6l89.8-69.5z" fill="#FBBC04"/><path d="M272 107.7c39.9-.6 78.4 14.7 107.5 42.6l80.2-80.2C407.5 24.3 345.6 0 272 0 166.7 0 72.6 54.4 27.6 152.8l89.8 71.7c21.8-65.4 82.7-113.9 154.6-116.8z" fill="#EA4335"/></svg>
      <span>Google-ээр нэвтрэх</span>
    </div>
  )
  return (
    <button
      type="button"
      className={`w-full h-11 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${className}`}
      {...props}
    >
      {content}
    </button>
  )
}


