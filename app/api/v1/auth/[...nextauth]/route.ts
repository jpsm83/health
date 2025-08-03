import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import bcrypt from "bcrypt";
import { IUser } from "@/interfaces/user";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    role: string;
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
        console.log(credentials);

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // connect before first call to DB
        await connectDb();

        try {
          const user = (await User.findOne({ email: credentials.email })
            .select("email password username role")
            .lean()) as Partial<IUser> | null;

          if (!user) {
            console.error("User not found");
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password || ""
          );

          if (!passwordMatch) {
            console.log("Invalid password!");
            return null;
          }

          // Return user data for NextAuth
          return {
            id: user._id?.toString() || "",
            email: user.email || "",
            name: user.username || "",
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  basePath: "/api/v1/auth",
  secret: process.env.AUTH_SECRET!,
  pages: {
    signOut: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  // Disable CSRF for testing (remove in production)
  useSecureCookies: false,
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and user role to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        token.role = (user as IUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut, auth } = authConfig;

// Custom handlers for API testing
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

  if (pathname.includes("/signin")) {
    try {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password required" },
          { status: 400 }
        );
      }

      // Use NextAuth's signIn function
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Sign in error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  if (pathname.includes("/signout")) {
    await signOut({ redirect: false });
    return NextResponse.json({ success: true });
  }

  return handlers.POST(req);
}
