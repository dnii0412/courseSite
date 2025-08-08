'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function CreateUserForm({ onClose }: { onClose: (created: boolean) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('student')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      if (!res.ok) throw new Error('Хэрэглэгч үүсгэхэд алдаа гарлаа')
      onClose(true)
    } catch (err) {
      alert((err as Error).message)
      onClose(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="grid gap-4 py-2" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="create-name">Нэр</Label>
        <Input id="create-name" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-email">И-мэйл</Label>
        <Input id="create-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-password">Нууц үг</Label>
        <Input id="create-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-role">Эрх</Label>
        <select id="create-role" className="border rounded-md px-3 py-2 text-sm" value={role} onChange={e => setRole(e.target.value as any)}>
          <option value="student">Сурагч</option>
          <option value="instructor">Багш</option>
          <option value="admin">Админ</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onClose(false)}>Цуцлах</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Үүсгэж байна...' : 'Үүсгэх'}</Button>
      </div>
    </form>
  )
}
