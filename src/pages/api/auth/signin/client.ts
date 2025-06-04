// pages/api/auth/signin/client.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcryptjs"; // use bcrypt to compare passwords

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

    // 1️⃣ Find client by email
    // const client = await prisma.client.findUnique({ where: { email } });

    const client = await prisma.client.findFirst({
      where: {
        email: {
          equals: req.body.email,
          mode: "insensitive", // important!
        },
      },
    });

    console.log("client: ", client);
    console.log("email: ", req.body.email);
    if (!client) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 2️⃣ Compare passwords (assumes you stored a hashed password)
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT
    const token = sign(
      { id: client.id, email: client.email, role: "client" },
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
        maxAge: 60 * 60 * 24, // 1 day
      })
    );

    return res.status(200).json({ success: true, client });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
