import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/user"
import { compare } from 'bcryptjs'

// Extend NextAuth types to include role
declare module "next-auth" {
  interface User {
    role?: string
    oauthProvider?: string
    oauthId?: string
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
    oauthProvider?: string
    oauthId?: string
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: 'public_profile'
        }
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        }
      }
    }),
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

          if (!user) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'USER'
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      console.log('JWT callback - Token:', token)
      console.log('JWT callback - User:', user)
      console.log('JWT callback - Account:', account)

      if (user) {
        token.role = user.role || 'USER'
        token.id = user.id
        if (account?.provider) {
          token.oauthProvider = account.provider
          token.oauthId = account.providerAccountId
        }
        console.log('JWT callback - Updated token:', token)
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('Session callback - Session:', session)
      console.log('Session callback - Token:', token)

      if (token) {
        session.user.id = token.id || token.sub!
        session.user.role = token.role as string
        // Add OAuth info to session if available
        if (token.oauthProvider) {
          (session.user as any).oauthProvider = token.oauthProvider;
          (session.user as any).oauthId = token.oauthId;
        }
        console.log('Session callback - Updated session:', session)
      }
      return session
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      console.log('SignIn callback - User:', user)
      console.log('SignIn callback - Account:', account)
      console.log('SignIn callback - Profile:', profile)

      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          await connectDB()
          console.log('OAuth signIn callback - Provider:', account.provider)
          console.log('OAuth signIn callback - User:', user)

          // For Facebook users, we might not have email access
          // Use the profile ID as a fallback identifier
          const userIdentifier = user.email || `fb_${account.providerAccountId}`

          // Check if user already exists
          let existingUser = await User.findOne({
            $or: [
              { email: user.email },
              { oauthId: account.providerAccountId, oauthProvider: account.provider }
            ]
          })

          if (!existingUser) {
            // Create new user with OAuth info
            const newUser = new User({
              name: user.name || `Facebook User ${account.providerAccountId}`,
              email: user.email || `fb_${account.providerAccountId}@facebook.com`,
              role: 'USER',
              oauthProvider: account.provider,
              oauthId: account.providerAccountId,
              // Set a default password for OAuth users (they won't use it)
              password: 'oauth_user_' + Math.random().toString(36).substr(2, 9)
            })

            await newUser.save()
            console.log('New OAuth user created:', newUser.email)

            // Update the user object with the MongoDB _id
            user.id = newUser._id.toString()
          } else {
            // Update existing user's OAuth info if needed
            if (!existingUser.oauthProvider || !existingUser.oauthId) {
              existingUser.oauthProvider = account.provider
              existingUser.oauthId = account.providerAccountId
              await existingUser.save()
              console.log('Updated existing user with OAuth info:', existingUser.email)
            }

            // Use the existing user's MongoDB _id
            user.id = existingUser._id.toString()
          }

          console.log('OAuth signIn callback - Final user object:', user)
          console.log('OAuth signIn callback - Success, user ID:', user.id)
          return true
        } catch (error) {
          console.error('Error during OAuth sign in:', error)
          return false
        }
      }

      return true
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('Redirect callback - URL:', url, 'Base URL:', baseUrl)

      // If the URL is relative, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }

      // If the URL is on the same domain, allow it
      if (url.startsWith(baseUrl)) {
        return url
      }

      // Default redirect to dashboard after successful OAuth
      return `${baseUrl}/dashboard`
    }
  },
  session: {
    strategy: "jwt" as const
  },
  secret: process.env.NEXTAUTH_SECRET
}

export { authOptions }
