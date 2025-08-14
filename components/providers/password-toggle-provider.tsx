"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface PasswordToggleContextType {
  isPasswordVisible: boolean
  setIsPasswordVisible: (visible: boolean) => void
}

const PasswordToggleContext = createContext<PasswordToggleContextType | undefined>(undefined)

export function PasswordToggleProvider({ children }: { children: ReactNode }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <PasswordToggleContext.Provider value={{ isPasswordVisible, setIsPasswordVisible }}>
      {children}
    </PasswordToggleContext.Provider>
  )
}

export function usePasswordToggle() {
  const context = useContext(PasswordToggleContext)
  if (context === undefined) {
    throw new Error('usePasswordToggle must be used within a PasswordToggleProvider')
  }
  return context
}
