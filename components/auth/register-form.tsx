'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[#1B3C53] font-medium">Нууц үг давтах</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60"
        />
      </div>

      <Button type="submit" className="w-full bg-[#456882] hover:bg-[#1B3C53] text-white transition-colors" disabled={isLoading}>
        {isLoading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
      </Button>
    </form>
  )
}
