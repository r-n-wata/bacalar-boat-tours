// decodes JWT token from request cookies
import { verify } from "jsonwebtoken";
import { NextApiRequest } from "next";

export function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    return verify(token, process.env.JWT_SECRET!);
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
