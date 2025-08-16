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
    role: string
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
    role: string
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
    // Only include Facebook provider if credentials are configured
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        authorization: {
          params: {
            scope: 'public_profile,email'
          }
        },
        profile(profile) {
          return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.picture?.data?.url,
            role: 'USER'
          }
        }
      })
    ] : []),
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
      if (user) {
        token.role = user.role || 'USER'
        token.id = user.id
        if (account?.provider) {
          token.oauthProvider = account.provider
          token.oauthId = account.providerAccountId
        }
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id || token.sub!
        session.user.role = token.role as string
        // Add OAuth info to session if available
        if (token.oauthProvider) {
          (session.user as any).oauthProvider = token.oauthProvider;
          (session.user as any).oauthId = token.oauthId;
        }
      }
      return session
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          await connectDB()

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

            // Update the user object with the MongoDB _id
            user.id = newUser._id.toString()
            
            // For new OAuth users, we want them to go through onboarding
            // The redirect callback will handle this
          } else {
            // Update existing user's OAuth info if needed
            if (!existingUser.oauthProvider || !existingUser.oauthId) {
              existingUser.oauthProvider = account.provider
              existingUser.oauthId = account.providerAccountId
              await existingUser.save()
            }

            // Use the existing user's MongoDB _id
            user.id = existingUser._id.toString()
          }

          return true
        } catch (error) {
          console.error('Error during OAuth sign in:', error)
          return false
        }
      }

      return true
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('NextAuth redirect callback - URL:', url, 'BaseURL:', baseUrl)
      
      // Handle OAuth redirects from register page
      if (url.includes('from=register') || url.includes('onboarding')) {
        console.log('Redirecting to onboarding')
        return `${baseUrl}/onboarding?from=register`
      }

      // Handle admin login redirects - prevent redirect to /auth/login
      if (url.includes('admin') || url.includes('admin/login')) {
        console.log('Admin redirect detected, going to admin panel')
        return `${baseUrl}/admin`
      }

      // Handle returnUrl for login flows
      if (url.startsWith('/') && !url.startsWith('/api')) {
        console.log('Handling returnUrl redirect')
        return `${baseUrl}${url}`
      }

      // Default redirect to courses for successful auth
      if (url.startsWith(baseUrl)) {
        console.log('Staying on same base URL')
        return url
      } else {
        console.log('Default redirect to courses')
        return `${baseUrl}/courses`
      }
    }
  },
  session: {
    strategy: "jwt" as const
  },
  secret: process.env.NEXTAUTH_SECRET
}

export { authOptions }
