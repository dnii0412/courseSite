'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const schema = z.object({ email: z.string().email('Имэйл буруу байна') })

export default function ResetPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  async function onSubmit() {
    // stub: no email sending yet
    alert('Reset холбоос таны и-мэйл рүү очно (stub)')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative">
        

        <h1 className="text-2xl font-semibold text-slate-900">Нууц үг сэргээх</h1>
        <p className="mt-1 text-sm text-slate-600">И-мэйлээ оруулна уу</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" aria-busy={isSubmitting}>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-slate-800">Имэйл</label>
            <input id="email" {...register('email')} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-invalid={!!errors.email || undefined} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <button
            disabled={!isValid || isSubmitting}
            className="w-full h-11 rounded-xl bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            Илгээх
          </button>
          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-sky-700 hover:underline">Нэвтрэх</Link>
          </div>
        </form>
      </div>
    </div>
  )
}


