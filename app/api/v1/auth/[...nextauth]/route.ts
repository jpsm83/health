import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Only expose route handlers from this file
const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
