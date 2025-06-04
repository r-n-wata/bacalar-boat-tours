import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../../lib/auth/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getUserFromRequest(req);

  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (user.role !== "client")
    return res.status(403).json({ error: "Forbidden" });

  return res.status(200).json({ message: "Hello Client!" });
}
