// pages/api/auth/signin/operator.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // 1️⃣ Find operator by email
    const operator = await prisma.operator.findUnique({ where: { email } });
    if (!operator) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, operator.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3️⃣ Create JWT with "role: operator"
    const token = sign(
      { id: operator.id, email: operator.email, role: "operator" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 4️⃣ Set cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
    );

    return res.status(200).json({ success: true, operator });
  } catch (error) {
    console.error("Operator sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
