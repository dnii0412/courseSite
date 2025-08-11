import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF]">
      <Card className="w-full max-w-md bg-white border-[#D2C1B6] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1B3C53]">Нэвтрэх</CardTitle>
          <CardDescription className="text-[#456882]">
            Өөрийн бүртгэлээр нэвтэрнэ үү
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm text-[#456882]">
            Бүртгэл байхгүй юу?{' '}
            <Link href="/auth/register" className="text-[#1B3C53] hover:text-[#456882] hover:underline transition-colors">
              Бүртгүүлэх
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
