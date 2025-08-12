"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { scorePassword } from '@/lib/password'
import { SocialButton } from '@/components/ui/SocialButton'
import { PasswordInput } from '@/components/ui/PasswordInput'

const schema = z.object({
  name: z.string().min(2, 'Нэр хамгийн багадаа 2 тэмдэгт').max(50),
  email: z.string().email('Имэйл буруу байна'),
  password: z
    .string()
    .min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'Үйлчилгээний нөхцөлтэй санал нэгдэнэ үү' }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Нууц үгүүд таарахгүй байна',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const { register, control, handleSubmit, watch, setFocus, formState: { errors, isSubmitting, isValid } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: undefined as unknown as true },
  })

  const pw = watch('password') || ''
  const strength = scorePassword(pw)
  const [showPw, setShowPw] = useState(false)

  async function onSubmit(values: z.infer<typeof schema>) {
    setApiError('')
    if (strength <= 1) {
      setAttemptedSubmit(true)
      setFocus('password')
      return
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setApiError(j.error || 'Алдаа гарлаа')
      setFocus('email')
      return
    }
    // success toast minimal
    alert('Амжилттай бүртгэгдлээ')
    setTimeout(() => router.push('/auth/login'), 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Бүртгүүлэх</h1>
        <p className="mt-1 text-sm text-slate-600">Шинэ бүртгэл үүсгэнэ үү</p>
        <div className="mt-6 space-y-4">
          <SocialButton onClick={() => (window.location.href = '/api/auth/signin/google')} />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-500">эсвэл</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <form onSubmit={handleSubmit(onSubmit as any, () => { setAttemptedSubmit(true); setFocus('name') })} className="space-y-4" aria-busy={isSubmitting}>
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-slate-800">Нэр</label>
              <input id="name" {...register('name')} aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? 'name-error' : undefined} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" />
              {errors.name && <p id="name-error" className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-800">Имэйл</label>
              <input id="email" type="email" {...register('email')} aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? 'email-error' : undefined} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" />
              {errors.email && <p id="email-error" className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-800">Нууц үг</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput id="password" value={field.value || ''} onChange={field.onChange} strength={strength as any} error={errors.password?.message} show={showPw} onToggleShow={() => setShowPw((v) => !v)} />
                )}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-800">Нууц үг давтах</label>
              <input id="confirmPassword" type={showPw ? 'text' : 'password'} {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword || undefined} aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" />
              {errors.confirmPassword && <p id="confirm-error" className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" {...register('terms')} className="h-4 w-4 rounded border-slate-300" />
              <label htmlFor="terms" className="text-sm text-slate-700">Үйлчилгээний нөхцөл, Нууцлалтай санал нийлж байна.</label>
            </div>
            {apiError && <div className="text-sm text-red-600">{apiError}</div>}
            {attemptedSubmit && strength <= 1 && (
              <div className="text-sm text-red-600">Нууц үг хэт сул байна. Дараах шалгууруудаас нэмээрэй: 8-оос урт, Том үсэг, Символ, Тоо.</div>
            )}
            <button disabled={!isValid || isSubmitting} className="w-full h-11 rounded-xl bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
              {isSubmitting ? 'Бүртгүүлж байна…' : 'Бүртгүүлэх'}
            </button>
          </form>
          <div className="text-center text-sm">
            Бүртгэлтэй юу?{' '}
            <Link href="/auth/login" className="text-sky-700 hover:underline">Нэвтрэх</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
