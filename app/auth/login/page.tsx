import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Нэвтрэх</CardTitle>
          <CardDescription>
            Өөрийн бүртгэлээр нэвтэрнэ үү
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Бүртгэл байхгүй юу?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Бүртгүүлэх
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
