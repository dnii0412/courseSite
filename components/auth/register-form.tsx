'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { GoogleOAuthButton } from './oauth-buttons'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: 'Алдаа',
        description: 'Нууц үг таарахгүй байна',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      toast({
        title: 'Амжилттай бүртгэгдлээ',
        description: 'Тавтай морилно уу!'
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'Алдаа гарлаа',
        description: 'Бүртгэл үүсгэхэд алдаа гарлаа',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#1B3C53] font-medium">Нэр</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Таны нэр"
          className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#1B3C53] font-medium">И-мэйл хаяг</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#1B3C53] font-medium">Нууц үг</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Нууц үгийг нуух' : 'Нууц үгийг харах'}
            className="absolute inset-y-0 right-0 px-3 text-[#456882] hover:text-[#1B3C53]"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[#1B3C53] font-medium">Нууц үг давтах</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Нууц үгийг нуух' : 'Нууц үгийг харах'}
            className="absolute inset-y-0 right-0 px-3 text-[#456882] hover:text-[#1B3C53]"
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#456882] hover:bg-[#1B3C53] text-white transition-colors" disabled={isLoading}>
        {isLoading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
      </Button>

      <GoogleOAuthButton mode="register" />
    </form>
  )
}
