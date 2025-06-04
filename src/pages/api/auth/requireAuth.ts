// lib/auth/requireAuth.ts
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

export function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const token = parse(req.headers.cookie || "").token;
  if (!token) return null;
  try {
    return verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
