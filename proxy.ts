import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_LOGIN_PATH, verifyAdminToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL(AUTH_LOGIN_PATH, request.url));
    }

    try {
      const payload = await verifyAdminToken(token);
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL(AUTH_LOGIN_PATH, request.url));
      }
    } catch {
      return NextResponse.redirect(new URL(AUTH_LOGIN_PATH, request.url));
    }
  }

  if (pathname === AUTH_LOGIN_PATH && token) {
    try {
      const payload = await verifyAdminToken(token);
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/backdoor-entry"],
};
