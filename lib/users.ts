// Minimal user repository with in-memory fallback
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

type CreateUserParams = { name: string; email: string; passwordHash: string; role?: 'USER' | 'ADMIN' }

export async function findUserByEmail(email: string) {
  try {
    await connectDB()
    return await User.findOne({ email }).lean()
  } catch {
    return null
  }
}

export async function createUser({ name, email, passwordHash, role = 'USER' }: CreateUserParams) {
  await connectDB()
  const user = await User.create({ name, email, password: passwordHash, role })
  return { id: String(user._id), name: user.name, email: user.email, role: user.role }
}

export async function findUserById(id: string) {
  try {
    await connectDB()
    return await User.findById(id).lean()
  } catch {
    return null
  }
}


