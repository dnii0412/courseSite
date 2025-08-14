'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { signIn } from 'next-auth/react'
import { Chrome, Facebook, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthProviders, setOauthProviders] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()

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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      // Sign in immediately after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: 'Account created successfully!',
        description: 'Welcome to New Era!'
      })

      // Redirect to home page
      router.push('/')
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'facebook') => {
    signIn(provider, {
      callbackUrl: '/'
    })
  }

  const togglePasswords = () => {
    setShowPasswords(prev => !prev)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Enter your full name"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            placeholder="your@email.com"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPasswords ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              placeholder="••••••••"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={togglePasswords}
              aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <EyeOff className="h-5 w-4" /> : <Eye className="h-5 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              placeholder="••••••••"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={togglePasswords}
              aria-label={showPasswords ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <EyeOff className="h-5 w-4" /> : <Eye className="h-5 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
                Sign up with Google
              </Button>
            )}

            {oauthProviders.includes('facebook') && (
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('facebook')}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-colors"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Continue with Facebook
              </Button>
            )}
          </div>
        </>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
