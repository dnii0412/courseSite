import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { connectDB } from './mongodb'
import { User } from './models/user'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(process.env.MONGODB_URI!),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB()

          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            // Create new user from OAuth
            await User.create({
              name: user.name || 'Unknown User',
              email: user.email!,
              password: '', // OAuth users don't have passwords
              role: 'USER',
              oauthProvider: account.provider,
              oauthId: profile?.sub || profile?.id,
            })
          }

          return true
        } catch (error) {
          console.error('OAuth sign in error:', error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // After successful sign in, redirect to dashboard
      if (url.startsWith('/dashboard')) {
        return url
      }
      // Default redirect to dashboard for successful auth
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith('/')) return `${baseUrl}${url}`
      else return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
