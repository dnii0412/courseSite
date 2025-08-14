'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

interface GoogleOAuthButtonProps {
  mode?: 'login' | 'register'
  className?: string
}

export function GoogleOAuthButton({ mode = 'login', className }: GoogleOAuthButtonProps) {
  const handleGoogleSignIn = () => {
    signIn('google', { 
      callbackUrl: '/dashboard',
      redirect: true 
    })
  }

  const buttonText = mode === 'register' 
    ? 'Continue with Google' 
    : 'Sign in with Google'

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      className={`w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-colors ${className || ''}`}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  )
}
