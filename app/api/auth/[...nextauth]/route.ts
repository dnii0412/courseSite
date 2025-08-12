import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { findUserByEmail } from '@/lib/users'
import { verifyPassword } from '@/lib/password'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '')
        const password = String(credentials?.password || '')
        const user = await findUserByEmail(email)
        if (!user) return null
        const ok = await verifyPassword(password, user.password)
        if (!ok) return null
        return { id: String(user._id), name: user.name, email: user.email, image: undefined }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: 'jwt' },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


