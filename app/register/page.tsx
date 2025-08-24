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

function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()
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

    const success = await register(name, email, password)
    if (success) {
      router.push("/")
    } else {
      setError("Registration failed. Please try again.")
    }
    setLoading(false)
  }

  const handleGoogleLogin = () => {
    setError("")
    // Direct redirect to Google OAuth - no fetch needed
    window.location.href = "/api/auth/google"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Register</h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
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
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Google Login
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
