import type { NextAuthConfig } from "next-auth";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcryptjs from "bcryptjs";
import z from "zod";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days to expire the session
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        try {
          // Search email address in db
          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (!user) return null; // if user doesn't exist return null

          // Compare the passwords
          if (!bcryptjs.compareSync(password, user.password)) return null;

          // Return user
          /* eslint-disable */
          const { password: _, ...rest } = user;
          /* eslint-enable */
          return rest;
        } catch (error) {
          console.error("Hubo un error en la autenticación", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Check if account and user already in token
      if (user) {
        // Login with credentials
        token.data = user;
      }
      return token;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { email: token.email! },
        include: { Sede: true }, // Include the Sede relation
      });

      if (!user) {
        // force signout and delete cookie if user don't exist or was deleted from DB
        throw new AuthError("USER_DELETED", { cause: "user_deleted" });
      }

      // eslint-disable-next-line
      session.user = token.data as any;

      //? Update user in case of any change during session.
      if (user) {
        /* eslint-disable */
        session.user.role = user.role;
        session.user.name = user.name;
        session.user.phone = user.phone;
        session.user.city = user.city;
        session.user.Sede = user.Sede;
        (session.user as any).password = user.password;
        /* eslint-enable */
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
});
