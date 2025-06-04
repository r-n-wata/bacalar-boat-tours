// src/middleware/withAuth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../shared/authOptions";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export function withAuth(handler: NextApiHandler, allowedRoles: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !allowedRoles.includes(session.user?.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    return handler(req, res);
  };
}
