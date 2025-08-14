import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import type { JWT } from "next-auth/jwt";
import { compare } from "bcryptjs"; // if you store hashed passwords; remove if not used
import { ObjectId } from "mongodb";

const googleId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? "";
const googleSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding?from=register", // after first-ever OAuth signup
  },

  providers: [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
      authorization: {
        params: { prompt: "select_account", access_type: "offline", response_type: "code" },
      },
    }),

    // OPTIONAL: adjust if you use Credentials for email/password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Lookup user in MongoDB "users" collection created by the adapter
        const client = await clientPromise;
        const user = await client.db().collection("users").findOne({ email: credentials.email });

        if (!user) return null;

        // If you store hashed passwords on user (e.g., user.password)
        // Replace this with your real password check:
        if (user.password) {
          const ok = await compare(credentials.password, user.password);
          if (!ok) return null;
        } else {
          // No password field -> reject credentials login
          return null;
        }

        return {
          id: (user._id as ObjectId).toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, req }) {
      // Optional stricter rule:
      // If arriving from /auth/login with Google and user doesn't exist yet, block.
      // If coming from /auth/register, allow creation.
      // Requires the adapter (enabled above).
      if (account?.provider === "google") {
        const referer = req?.headers?.get("referer") || "";
        const isRegisterFlow = referer.includes("/auth/register");

        const client = await clientPromise;
        const existing = await client.db().collection("users").findOne({ email: user.email });

        if (!existing && !isRegisterFlow) {
          // Send back to login with an error indicating user must register
          const base = process.env.NEXTAUTH_URL || "";
          const url = new URL("/auth/login", base);
          url.searchParams.set("error", "NEW_USER_MUST_REGISTER");
          // Throwing will make NextAuth redirect to the error page; return false to cancel silently.
          // We prefer return false to stay on the page.
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = (user as any).image ?? token.picture;
      }
      return token as JWT;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
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
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
