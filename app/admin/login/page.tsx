'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('') // нэр эсвэл и-мэйл
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(identifier.trim(), password)
      window.location.href = '/admin'
    } catch (e: any) {
      setError(e.message || 'Нэвтрэлт амжилтгүй боллоо')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-ink-900">Админ нэвтрэх</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-ink-700">Нэр</label>
              <Input value={identifier} onChange={(e)=>setIdentifier(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-ink-700">Нууц үг</label>
              <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </Button>
            <p className="text-xs text-ink-500 text-center">Энгийн хэрэглэгчид <Link className="underline" href="/auth/login">/auth/login</Link> хуудсыг ашиглана.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


