import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_LOGIN_PATH, verifyAdminToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const redirectToLogin = () => {
    const response = NextResponse.redirect(new URL(AUTH_LOGIN_PATH, request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  };

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return redirectToLogin();
    }

    try {
      const payload = await verifyAdminToken(token);
      if (payload.role !== "ADMIN" || !payload.sid) {
        return redirectToLogin();
      }
    } catch {
      return redirectToLogin();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/backdoor-entry"],
};
