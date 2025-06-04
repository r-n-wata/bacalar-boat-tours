// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Protect specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"], // only protect these paths
};
