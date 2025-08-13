'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return null
	const isDark = resolvedTheme === 'dark'
	return (
		<button
			aria-label="Toggle theme"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white/80 dark:bg-slate-900/60 backdrop-blur hover:bg-white dark:hover:bg-slate-900 transition-colors"
		>
			{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
		</button>
	)
}


