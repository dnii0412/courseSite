'use client'

import React from 'react'

type AdminTopbarProps = {
	title: string
	actions?: React.ReactNode
	children?: React.ReactNode
}

export function AdminTopbar({ title, actions, children }: AdminTopbarProps) {
	return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-sand-200">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {children ? <div className="mx-auto max-w-[1200px] px-4 md:px-6 pb-3 text-sm text-ink-500">{children}</div> : null}
    </div>
	)
}


