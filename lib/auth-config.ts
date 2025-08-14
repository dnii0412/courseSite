import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import { connectDB } from './mongodb'
import { User } from './models/user'
import bcrypt from 'bcryptjs'

// Extend NextAuth types to include role
declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

// Build providers array dynamically based on available environment variables
const providers = []

// Add Google provider if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      // Ensure proper callback handling
      checks: ['pkce', 'state'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    })
  )
}

// Add Facebook provider if configured
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  )
}

// Always add credentials provider
providers.push(
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      try {
        await connectDB()
        const user = await User.findOne({ email: credentials.email })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        }
      } catch (error) {
        console.error('Credentials auth error:', error)
        return null
      }
    }
  })
)

// Create MongoDB client for the adapter
const clientPromise = MongoClient.connect(process.env.MONGODB_URI!)

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers,
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
    async signIn({ user, account, profile, email }) {
      console.log('SignIn callback triggered:', { user: user?.email, account: account?.provider })
      
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          await connectDB()
          console.log('Database connected successfully')

          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email })
          console.log('Existing user check:', !!existingUser)

          if (!existingUser) {
            // Create new user from OAuth
            const newUser = await User.create({
              name: user.name || 'Unknown User',
              email: user.email!,
              role: 'USER',
              oauthProvider: account.provider,
              oauthId: (profile as any)?.sub || (profile as any)?.id,
            })
            console.log('New user created:', newUser._id)
          } else if (!existingUser.oauthProvider) {
            // Update existing user with OAuth info if they don't have it
            await User.findByIdAndUpdate(existingUser._id, {
              oauthProvider: account.provider,
              oauthId: (profile as any)?.sub || (profile as any)?.id,
            })
            console.log('Existing user updated with OAuth info')
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
      // Handle OAuth redirects from register page
      if (url.includes('from=register')) {
        return `${baseUrl}/onboarding?from=register`
      }

      // Handle returnUrl for login flows
      if (url.startsWith('/') && !url.startsWith('/api')) {
        return `${baseUrl}${url}`
      }

      // Default redirect to courses for successful auth
      if (url.startsWith(baseUrl)) return url
      else return `${baseUrl}/courses`
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Ensure proper OAuth callback handling
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}
