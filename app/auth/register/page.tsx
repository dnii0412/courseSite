import { GoogleOAuthButton } from '@/components/auth/oauth-buttons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF]">
      <Card className="w-full max-w-md bg-white border-[#D2C1B6] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1B3C53]">Create Account</CardTitle>
          <CardDescription className="text-[#456882]">
            Get started with your free account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-[#456882] mb-4">
                Sign up quickly and securely with your Google account
              </p>
            </div>
            
            <GoogleOAuthButton mode="register" />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-[#456882]">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-[#456882]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#1B3C53] hover:text-[#456882] hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
