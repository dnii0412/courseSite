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
        <Label htmlFor="name">Нэр</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Таны нэр"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">И-мэйл хаяг</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Нууц үг</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
      </Button>
    </form>
  )
}
