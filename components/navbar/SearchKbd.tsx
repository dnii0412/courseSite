"use client"

import * as React from "react"
import { Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { getI18nText } from "@/lib/nav"

interface SearchKbdProps {
  language: 'mn' | 'en'
}

export function SearchKbd({ language }: SearchKbdProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const quickLinks = [
    {
      title: getI18nText(language, 'home'),
      href: '/',
      description: getI18nText(language, 'home'),
    },
    {
      title: getI18nText(language, 'courses'),
      href: '/courses',
      description: getI18nText(language, 'courses'),
    },
    {
      title: 'AI Course',
      href: '/courses/ai-course',
      description: 'Machine Learning & Deep Learning',
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
      description: getI18nText(language, 'dashboard'),
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
        data-analytics="search-button"
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">
          {getI18nText(language, 'search')}...
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder={getI18nText(language, 'placeholder')} 
          className="h-12"
        />
        <CommandList>
          <CommandEmpty>{getI18nText(language, 'noResults')}</CommandEmpty>
          <CommandGroup heading={getI18nText(language, 'popular')}>
            {quickLinks.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => runCommand(() => router.push(link.href))}
                data-analytics="search-result"
                data-analytics-href={link.href}
              >
                <Command className="mr-2 h-4 w-4" />
                <div>
                  <div className="font-medium">{link.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {link.description}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
