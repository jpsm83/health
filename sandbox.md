    async jwt({ token, user }) {
      // Add user data to token on first sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.imageUrl = user.imageUrl;
      }

      // Ensure we have the correct MongoDB ObjectId
      if (token.email && !token.id) {
        try {
          await connectDb();
          const dbUser = await User.findOne({ email: token.email })
            .select("_id role imageUrl")
            .lean() as { _id: { toString(): string }; role: string; imageUrl?: string } | null;
          
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.imageUrl = dbUser.imageUrl;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
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
        session.user.imageUrl = token.imageUrl as string;
      }
      return session;
    },
