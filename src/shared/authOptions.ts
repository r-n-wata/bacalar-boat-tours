// shared/authOptions.ts
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "emailPassword",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(cred) {
        const { email, password } = cred ?? {};
        if (!email || !password) return null;

        // Try Client, then Operator
        const client = await prisma.client.findUnique({ where: { email } });
        const operator = await prisma.operator.findUnique({ where: { email } });

        const record = client ?? operator;
        if (!record) return null;

        const isValid = await bcrypt.compare(password, record.password);
        if (!isValid) return null;

        return {
          id: String(record.id), // ✅ now it's a string
          email: record.email,
          role: client ? "client" : "operator",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // ✅ ADD THIS
  },
  pages: {
    signIn: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      //  session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      return session;
    },
  },
};
