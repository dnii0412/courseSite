"use client"

import type React from "react"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/useAuth"
import { Header } from "@/components/header"
import { GoogleButton } from "@/components/ui/google-button"
import { signIn } from "next-auth/react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for OAuth error messages
  useEffect(() => {
    const oauthError = searchParams.get('error')
    if (oauthError) {
      switch (oauthError) {
        case 'oauth_not_configured':
          setError('Google login is not configured. Please contact the administrator.')
          break
        case 'google_auth_failed':
          setError('Google authentication failed. Please try again.')
          break
        case 'no_code':
          setError('Authentication code not received. Please try again.')
          break
        case 'no_id_token':
          setError('Authentication token not received. Please try again.')
          break
        case 'no_email':
          setError('Email not provided by Google. Please try again.')
          break
        case 'user_creation_failed':
          setError('Failed to create user account. Please try again.')
          break
        case 'oauth_failed':
          setError('OAuth authentication failed. Please try again.')
          break
        default:
          setError('Authentication failed. Please try again.')
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/")
    } else {
      setError("Invalid email or password")
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError("")
    try {
      await signIn("google", { 
        callbackUrl: "/",
        redirect: true 
      })
    } catch (error) {
      setError("Google authentication failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Login</h2>
          </div>
          <form className="space-y-6 rounded-2xl border p-6 md:p-8 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft animate-authIn focus-within:shadow-lg transition-all" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                autoComplete="current-password"
              />
            </div>
            <div className="text-right">
              <Link href="/reset-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center" aria-live="polite">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full transition-all hover:scale-[1.01] active:scale-[.99] hover:shadow-md hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <GoogleButton onClick={handleGoogleLogin}>
              Continue with Google
            </GoogleButton>
          </form>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
