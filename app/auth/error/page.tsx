'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support if this problem persists.'
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact your administrator.'
  },
  Verification: {
    title: 'Verification Required',
    description: 'The sign in link is no longer valid. It may have expired or been already used.'
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was an error during the OAuth sign in process. Please try again.'
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error during the OAuth callback. Please try again.'
  },
  OAuthCreateAccount: {
    title: 'OAuth Account Creation Error',
    description: 'Unable to create OAuth account. Please try again or use a different sign in method.'
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This email is already associated with a different account. Please sign in with the original method.'
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Error',
    description: 'Unable to create account with this email. Please try again or use a different email.'
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error during the callback process. Please try again.'
  },
  OAuthSignout: {
    title: 'OAuth Sign Out Error',
    description: 'There was an error during the sign out process. Please try again.'
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'Please sign in to access this page.'
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.'
  }
}

function AuthErrorContent() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const error = searchParams.get('error') || 'Default'

  const errorInfo = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">{errorInfo.title}</CardTitle>
          <CardDescription className="text-gray-600">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            Error code: <code className="bg-gray-100 px-2 py-1 rounded">{error}</code>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/register">Create New Account</Link>
            </Button>
          </div>
          
          <div className="text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
              Return to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
