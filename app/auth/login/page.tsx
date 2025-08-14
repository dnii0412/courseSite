"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GoogleLoginButton, FacebookLoginButton } from '@/components/auth/GoogleButtons'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordToggle } from '@/components/ui/password-toggle'
import { usePasswordToggle } from '@/components/providers/password-toggle-provider'

const schema = zod.object({
  email: zod.string().email('Имэйл хаяг буруу байна'),
  password: zod.string().min(1, 'Нууц үг оруулна уу'),
})

export default function LoginPage() {
  const [apiError, setApiError] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isPasswordVisible, setIsPasswordVisible } = usePasswordToggle()
  const router = useRouter()

  // Custom resolver that only validates when hasSubmitted is true
  const customResolver = (values: any) => {
    if (!hasSubmitted) {
      return { values, errors: {} }
    }
    const result = schema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors = result.error.flatten().fieldErrors
    return {
      values,
      errors: {
        email: fieldErrors.email ? { message: fieldErrors.email[0] } : undefined,
        password: fieldErrors.password ? { message: fieldErrors.password[0] } : undefined,
      }
    }
  }

  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<zod.infer<typeof schema>>({
    resolver: customResolver,
  })

  const onSubmit = async (values: zod.infer<typeof schema>) => {
    setHasSubmitted(true)
    setApiError('')
    setIsSubmitting(true)

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setApiError('Имэйл эсвэл нууц үг буруу байна')
      } else {
        // Redirect to courses page after successful login
        router.push('/courses')
      }
    } catch (error) {
      setApiError('Серверийн алдаа')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Нэвтрэх</h1>
          <p className="text-gray-600">Бүртгэлтэй имэйл хаягаа оруулна уу</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Имэйл</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Таны имэйл"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Таны нууц үг"
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <PasswordToggle
                    id="login-password"
                    isGlobalVisible={isPasswordVisible}
                    onToggle={setIsPasswordVisible}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {apiError && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {apiError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Эсвэл</span>
              </div>
            </div>

            <GoogleLoginButton />

            <div className="mt-4">
              <FacebookLoginButton />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Бүртгэл байхгүй юу?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Бүртгүүлэх
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
