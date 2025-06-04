// pages/api/auth/signup/business.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import prisma from "../../../../lib/prisma";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export const config = { api: { bodyParser: false } };

const uploadDir = path.join(process.cwd(), "/public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

/* ---------------------- helpers ---------------------- */
const normalizeFields = (raw: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const k in raw) {
    const v = Array.isArray(raw[k]) ? raw[k][0] : raw[k];
    out[k] = v === "true" ? true : v === "false" ? false : v;
  }
  return out;
};
/* ----------------------------------------------------- */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: true, uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: "Bad form data" });
    }

    const f = normalizeFields(fields);

    try {
      /* 1️⃣  — Dedup email */
      if (await prisma.operator.findUnique({ where: { email: f.email } })) {
        return res
          .status(400)
          .json({ error: "A business with this email already exists." });
      }

      /* 2️⃣  — Create business */
      const operator = await prisma.operator.create({
        data: {
          name: f.name,
          email: f.email,
          phone: f.phone,
          password: f.password, // 🔐 hash in real apps!
          logo: (files as any).logo?.filepath ?? null,
          sailing: f["services[sailing]"],
          diving: f["services[diving]"],
          option3: f["services[option3]"],
        },
      });

      /* 3️⃣  — Issue JWT & cookie */
      const token = sign(
        { id: operator.id, email: operator.email, role: "operator" },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

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

      return res.status(201).json({ success: true, operator });
    } catch (e) {
      console.error("Database error:", e);
      return res.status(500).json({ error: "Failed to save business" });
    }
  });
}
