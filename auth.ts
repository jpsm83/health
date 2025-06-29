import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import bcrypt from "bcrypt";
import { IUser } from "./interfaces/user";
import { handleApiError } from "./app/api/utils/handleApiError";
import { NextResponse } from "next/server";

// Define an interface for the credentials
interface Credentials {
  email: string;
  password: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, email, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your password",
        },
      },

      async authorize(credentials: Credentials, req: Request) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!credentials?.email || !credentials?.password) {
          return new NextResponse(
            JSON.stringify({
              message: "Invalid credentials!",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // connect before first call to DB
        await connectDb();
        
        try {
          const user = (await User.findOne({ email: credentials.email })
            .select("email password")
            .lean()) as Partial<IUser> | null;

          if (!user) {
            console.error("User not found");
            return new NextResponse(
              JSON.stringify({
                message: "User not found!",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            console.log("Invalid password!");
            return new NextResponse(
              JSON.stringify({
                message: "Invalid credentials!",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          return new NextResponse(
            JSON.stringify({
              message: `New user created successfully`,
              id: user._id?.toString(),
              email: user.email,
              name: user.username,
            }),
            {
              status: 201,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return handleApiError("Authentication error!", error as string);
        }
      },
    }),
  ],
  basePath: "/api/v1/auth", // 👈 this is required for custom path
  secret: process.env.AUTH_SECRET!,
  pages: {
    signOut: "/", // Redirect to root ("/") after sign-out
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
    async signIn({ account, profile }) {
        if (account.provider === "google") {
          return profile.email_verified && profile.email.endsWith("@example.com")
        }
        return true // Do different verification for other providers that don't have `email_verified`
      },
  }
});
