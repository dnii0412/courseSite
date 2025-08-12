"use client"

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SocialButton } from '@/components/ui/SocialButton'

const schema = z.object({
  email: z.string().email('Имэйл буруу байна'),
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
})

export default function LoginPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, setFocus } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setApiError('')
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
    })
    if (!res || res.error) {
      setApiError('И-мэйл эсвэл нууц үг буруу байна')
      setFocus('email')
      return
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Нэвтрэх</h1>
        <p className="mt-1 text-sm text-slate-600">Өөрийн бүртгэлээр нэвтэрнэ үү</p>

        <div className="mt-6 space-y-4">
          <SocialButton onClick={() => signIn('google', { callbackUrl: '/dashboard' })} />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-500">эсвэл</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit, () => setFocus('email'))} className="space-y-4" aria-busy={isSubmitting}>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-800">Имэйл</label>
              <input id="email" type="email" {...register('email')} aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? 'email-error' : undefined} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" />
              {errors.email && <p id="email-error" className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-800">Нууц үг</label>
              <input id="password" type="password" {...register('password')} aria-invalid={!!errors.password || undefined} aria-describedby={errors.password ? 'password-error' : undefined} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" />
              {errors.password && <p id="password-error" className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
            {apiError && <div className="text-sm text-red-600">{apiError}</div>}
            <div className="flex items-center justify-between">
              <Link href="/auth/reset" className="text-sm text-sky-700 hover:underline">Нууц үг мартсан?</Link>
            </div>
            <button disabled={!isValid || isSubmitting} className="w-full h-11 rounded-xl bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
              {isSubmitting ? 'Нэвтэрч байна…' : 'Нэвтрэх'}
            </button>
          </form>

          <div className="text-center text-sm">
            Бүртгэл байхгүй юу?{' '}
            <Link href="/auth/register" className="text-sky-700 hover:underline">Бүртгүүлэх</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
