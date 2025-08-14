'use client'

import React from 'react'

type AdminTopbarProps = {
	title: string
	actions?: React.ReactNode
	children?: React.ReactNode
}

export function AdminTopbar({ title, actions, children }: AdminTopbarProps) {
	return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-black">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      </div>
      {children && <div className="px-4 pb-3 text-sm text-gray-500">{children}</div>}
    </div>
	)
}


