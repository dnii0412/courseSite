import bcrypt from 'bcryptjs'

export function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0
  const lengthPoint = pw.length > 8 ? 1 : 0
  const upper = /[A-Z]/.test(pw) ? 1 : 0
  const number = /\d/.test(pw) ? 1 : 0
  const symbol = /[^\w\s]/.test(pw) ? 1 : 0
  const raw = lengthPoint + upper + number + symbol
  return (raw > 4 ? 4 : raw) as 0 | 1 | 2 | 3 | 4
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}


