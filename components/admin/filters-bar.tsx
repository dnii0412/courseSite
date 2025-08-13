'use client'

import React from 'react'

type FiltersBarProps = {
	children?: React.ReactNode
	sticky?: boolean
}

export function FiltersBar({ children, sticky = false }: FiltersBarProps) {
	return (
		<div className={`${sticky ? 'sticky top-[56px] md:top-[64px] z-20' : ''} bg-white/90 backdrop-blur border-b`}> 
			<div className="mx-auto max-w-7xl px-2 md:px-6 py-2.5 flex flex-wrap gap-2 items-center">{children}</div>
		</div>
	)
}


