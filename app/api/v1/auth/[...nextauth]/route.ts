import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import crypto from "crypto";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import { sendEmailConfirmation } from "@/lib/utils/emailService";

import { IUser } from "@/interfaces/user";

// Extend types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      imageUrl?: string;
    };
  }
}
// NextAuth configuration
const authOptions: NextAuthConfig = {
  providers: [
    // Google OAuth (sign in + signup if not exists)
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Credentials login only (no signup here)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDb();

          const user = (await User.findOne({ email: credentials.email })
            .select("_id email password username role imageUrl")
            .lean()) as Partial<IUser> | null;

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user._id?.toString() || "",
            email: user.email!,
            name: user.username!,
            role: user.role || "user",
            imageUrl: user.imageUrl,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET!,
  basePath: "/api/v1/auth",
  // Disable CSRF for testing (remove in production)
  useSecureCookies: false,
  debug: process.env.NODE_ENV === "development",

  // Callbacks
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          await connectDb();
          const existingUser = await User.findOne({ email: profile.email });

          // Try to get browser info from the state parameter
          let browserLanguage = "en"; // Default fallback
          let browserRegion = "US"; // Default fallback

          // The state parameter contains browser info passed from the frontend
          // This will be available in the account object
          if (account.state && typeof account.state === "string") {
            try {
              const stateData = JSON.parse(account.state);
              browserLanguage = stateData.browserLanguage || "en";
              browserRegion = stateData.browserRegion || "US";
            } catch {
              throw new Error("Could not parse state data, using defaults");
            }
          }

          if (!existingUser) {
            const newUser = new User({
              email: profile.email,
              username: (profile.name || profile.email?.split("@")[0] || "user_" + Math.random().toString(36).slice(-6))
                .replace(/[^a-zA-Z0-9_-]/g, '') // Remove special characters, keep only letters, numbers, underscores, and dashes
                .replace(/\s+/g, '_'), // Replace spaces with underscores
              role: "user",
              birthDate: new Date("2000-02-29"),
              lastLogin: new Date(),
              imageUrl: profile.picture,
              preferences: {
                language: browserLanguage, // From browser
                region: browserRegion, // From browser
                contentLanguage: browserLanguage, // From browser
              },
              password: crypto.randomUUID(), // Google users don’t need passwords
            });
            await newUser.save();
          }
        } catch (error) {
          console.error("Error in Google sign-in callback:", error);
          // Don't throw error here, let the user sign in
        }
        return true;
      }
      return true; // Allow all other sign-in methods
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.imageUrl = user.imageUrl;
      }

      // If Google, make sure we sync with DB
      if (token.email) {
        await connectDb();
        const dbUser = (await User.findOne({ email: token.email })
          .select("_id role imageUrl username")
          .lean()) as IUser | null;

        if (dbUser) {
          token.id = dbUser._id?.toString();
          token.role = dbUser.role;
          token.imageUrl = dbUser.imageUrl;
          token.name = dbUser.username;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.imageUrl = token.imageUrl as string | undefined;
      }
      return session;
    },
  },

  // Disable NextAuth's default redirect behavior - let frontend handle all navigation
  pages: {
    signIn: "/signin",
  },
};

// This gives you handlers + helpers automatically
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export const { GET, POST } = handlers;