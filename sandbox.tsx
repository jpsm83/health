import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import bcrypt from "bcrypt";
import { IUser } from "@/interfaces/user";

// Extend NextAuth types to match our ISession interface
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

  interface User {
    role: string;
    imageUrl?: string;
  }
}

// Define an interface for the credentials
interface Credentials {
  email: string;
  password: string;
}

const authConfig = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // connect before first call to DB
        await connectDb();

        try {
          const user = (await User.findOne({ email: credentials.email })
            .select("_id email password username role imageUrl")
            .lean()) as Partial<IUser> | null;

          if (!user) {
            throw new Error(`User not found for email ${credentials.email}`);
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password || ""
          );

          if (!passwordMatch) {
            throw new Error(`Invalid password for user ${credentials.email}`);
          }

          // Return user data for NextAuth
          return {
            id: user._id?.toString() || "",
            email: user.email || "",
            name: user.username || "",
            role: user.role || "user",
            imageUrl: user.imageUrl || undefined,
          };
        } catch (error) {
          throw new Error("Authentication system error: " + error);
        }
      },
    }),
  ],
  basePath: "/api/v1/auth",
  secret: process.env.NEXTAUTH_SECRET!,
  debug: false,
  session: {
    strategy: "jwt",
  },
  // Disable CSRF for testing (remove in production)
  useSecureCookies: false,
  callbacks: {
    async signIn({ account, profile }) {
      // Handle Google OAuth signup - create user if they don't exist
      if (account?.provider === "google" && profile) {
        try {
          await connectDb();

          // Check if user already exists
          const existingUser = await User.findOne({ email: profile.email });

          if (!existingUser) {
            // Set birth date to February 29, 2000
            const birthDate = new Date("2000-02-29");

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

            // Create new user from Google profile
            const newUser = new User({
              email: profile.email,
              username: (
                profile.name ||
                profile.email?.split("@")[0] ||
                "user"
              ).replace(/[^a-zA-Z0-9_-]/g, "_"),
              role: "user",
              birthDate: birthDate, // February 29, 2000
              lastLogin: new Date(), // Required field
              imageUrl: profile.picture, // Google profile picture
              preferences: {
                language: browserLanguage, // From browser
                region: browserRegion, // From browser
                contentLanguage: browserLanguage, // From browser
              },
              // Google OAuth users don't have passwords - set a random one
              password:
                Math.random().toString(36).slice(-10) +
                Math.random().toString(36).slice(-10),
            });

            await newUser.save();
          }

          return true;
        } catch (error) {
          throw new Error("Error creating Google OAuth user: " + error);
        }
      }

      return true;
    },
    async jwt({ token, account, user }) {
      // Only run this when we have new user data (during sign in)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.imageUrl = user.imageUrl;
      }

      // For Google OAuth, ensure we have the correct user ID
      if (account?.provider === "google" && token.email) {
        try {
          await connectDb();
          const dbUser = (await User.findOne({ email: token.email })
            .select("_id role imageUrl username")
            .lean()) as {
            _id: { toString(): string };
            role: string;
            imageUrl?: string;
            username: string;
          } | null;

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.imageUrl = dbUser.imageUrl;
            token.name = dbUser.username;
          }
        } catch (error) {
          console.error("JWT callback - DB fetch error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user = {
          ...session.user,
          id: (token.id as string) || "",
          role: (token.role as string) || "user",
          email: token.email || "",
          name: token.name || "",
          imageUrl: token.imageUrl as string | undefined,
        };
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut, auth } = authConfig;

// Next.js API route handler
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.includes("/session")) {
    const session = await auth();
    return NextResponse.json(session);
  }

  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle custom endpoints, let NextAuth handle OAuth flows
  if (pathname.includes("/signout")) {
    await signOut({ redirect: false });
    return NextResponse.json({ success: true });
  }

  // Let NextAuth handle all other requests (including OAuth)
  return handlers.POST(req);
}