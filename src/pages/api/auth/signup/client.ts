// pages/api/auth/signup/client.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, password, terms } = req.body;

  try {
    // 1️⃣ Check if email already exists
    const existingClient = await prisma.client.findUnique({ where: { email } });
    if (existingClient) {
      return res
        .status(400)
        .json({ error: "Client with this email already exists" });
    }

    // 2️⃣ Create client
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        password, // ⚠️ In production, hash this!
        terms: Boolean(terms),
      },
    });

    // 3️⃣ Create JWT
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

    return res.status(201).json({ success: true, client });
  } catch (error) {
    // Validate required fields
    if (!email || !name || !phone || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
