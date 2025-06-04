// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // 👈 Add this
    };
  }

  interface User {
    role?: string; // Optional if you're adding it directly
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // 👈 Add this
  }
}
