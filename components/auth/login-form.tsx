'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { signIn } from 'next-auth/react'
import { Chrome, Facebook } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthProviders, setOauthProviders] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/courses'

  useEffect(() => {
    // Fetch OAuth provider availability from server
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers')
        if (response.ok) {
          const providers = await response.json()
          const availableProviders = []
          if (providers.google.enabled) availableProviders.push('google')
          if (providers.facebook.enabled) availableProviders.push('facebook')
          setOauthProviders(availableProviders)
        }
      } catch (error) {
        console.error('Failed to fetch OAuth providers:', error)
      }
    }

    fetchProviders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use redirect: true to let NextAuth handle the redirect
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: returnUrl,
      })

      // If we get here, there was an error (successful login redirects automatically)
      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: 'Invalid email or password',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'facebook') => {
    signIn(provider, { 
      callbackUrl: returnUrl
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Only show OAuth section if providers are available */}
      {oauthProviders.length > 0 && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {oauthProviders.includes('google') && (
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-colors"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            )}

            {oauthProviders.includes('facebook') && (
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('facebook')}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-colors"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Sign in with Facebook
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
