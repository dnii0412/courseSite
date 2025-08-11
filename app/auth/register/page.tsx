import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF]">
      <Card className="w-full max-w-md bg-white border-[#D2C1B6] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1B3C53]">Бүртгүүлэх</CardTitle>
          <CardDescription className="text-[#456882]">
            Шинэ бүртгэл үүсгэнэ үү
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm text-[#456882]">
            Бүртгэлтэй юу?{' '}
            <Link href="/auth/login" className="text-[#1B3C53] hover:text-[#456882] hover:underline transition-colors">
              Нэвтрэх
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
