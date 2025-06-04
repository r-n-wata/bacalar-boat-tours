import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the auth token (or session cookie)
  res.setHeader(
    "Set-Cookie",
    serialize("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: -1, // Expire immediately
    })
  );

  res.status(200).json({ message: "Logged out successfully" });
}
