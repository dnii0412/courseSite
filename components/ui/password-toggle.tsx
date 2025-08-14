"use client"

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PasswordToggleProps {
    id: string
    className?: string
    onToggle?: (isVisible: boolean) => void
    isGlobalVisible?: boolean
}

export function PasswordToggle({ id, className, onToggle, isGlobalVisible }: PasswordToggleProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isGlobalVisible !== undefined) {
            setIsVisible(isGlobalVisible)
        }
    }, [isGlobalVisible])

    const handleToggle = () => {
        const newState = !isVisible
        setIsVisible(newState)
        onToggle?.(newState)
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent", className)}
            onClick={handleToggle}
        >
            {isVisible ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
                <Eye className="h-4 w-4 text-gray-500" />
            )}
            <span className="sr-only">{isVisible ? 'Hide password' : 'Show password'}</span>
        </Button>
    )
}
