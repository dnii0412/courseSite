"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleRegisterButton, FacebookRegisterButton } from '@/components/auth/GoogleButtons'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordToggle } from '@/components/ui/password-toggle'
import { usePasswordToggle } from '@/components/providers/password-toggle-provider'

const schema = zod.object({
  name: zod.string().min(1, 'Нэр оруулна уу'),
  email: zod.string().email('Имэйл хаяг буруу байна'),
  phone: zod.string().min(1, 'Утасны дугаар оруулна уу'),
  password: zod.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  confirmPassword: zod.string().min(1, 'Нууц үг давтах'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Нууц үг таарахгүй байна",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')
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
        name: fieldErrors.name ? { message: fieldErrors.name[0] } : undefined,
        email: fieldErrors.email ? { message: fieldErrors.email[0] } : undefined,
        phone: fieldErrors.phone ? { message: fieldErrors.phone[0] } : undefined,
        password: fieldErrors.password ? { message: fieldErrors.password[0] } : undefined,
        confirmPassword: fieldErrors.confirmPassword ? { message: fieldErrors.confirmPassword[0] } : undefined,
      }
    }
  }

  const { register, handleSubmit, watch, setFocus, formState: { errors } } = useForm<zod.infer<typeof schema>>({
    resolver: customResolver,
  })

  const onSubmit = async (values: zod.infer<typeof schema>) => {
    setHasSubmitted(true)
    setApiError('')
    setApiSuccess('')
    setIsSubmitting(true)

    try {
      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setApiSuccess('Бүртгэл амжилттай үүслээ! Нэвтрэх хуудас руу шилжиж байна...')
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setApiError(data.error || 'Бүртгүүлэхэд алдаа гарлаа')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setApiError('Серверийн алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Бүртгүүлэх</h1>
          <p className="text-gray-600">Шинэ бүртгэл үүсгэх</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Нэр</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Таны нэр"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

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
                <Label htmlFor="phone">Утасны дугаар</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Утасны дугаар"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Нууц үг"
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <PasswordToggle
                    id="register-password"
                    isGlobalVisible={isPasswordVisible}
                    onToggle={setIsPasswordVisible}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Нууц үг давтах"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <PasswordToggle
                    id="register-confirm-password"
                    isGlobalVisible={isPasswordVisible}
                    onToggle={setIsPasswordVisible}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {apiError && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {apiError}
                </div>
              )}

              {apiSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  {apiSuccess}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Бүртгэж байна..." : "Бүртгүүлэх"}
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

            <GoogleRegisterButton />

            <div className="mt-4">
              <FacebookRegisterButton />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Бүртгэлтэй юу?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Нэвтрэх
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
