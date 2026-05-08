import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { isAdminSessionActive, touchAdminSession } from "@/lib/admin-session";
import { apiErrorResponse } from "@/lib/api-error";
import { AUTH_COOKIE_NAME, AUTH_LOGIN_PATH, verifyAdminToken } from "@/lib/auth";

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return null;
    }

    const payload = await verifyAdminToken(token);
    if (payload.role !== "ADMIN") {
      return null;
    }

    if (!payload.sid) {
      return null;
    }

    const hasActiveSession = await isAdminSessionActive(payload.sid);
    if (!hasActiveSession) {
      return null;
    }

    await touchAdminSession(payload.sid);

    return payload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect(AUTH_LOGIN_PATH);
  }
  return admin;
}

type ApiAdminAuthResult =
  | { ok: true; admin: NonNullable<Awaited<ReturnType<typeof getCurrentAdmin>>> }
  | { ok: false; response: NextResponse };

export async function requireAdminApi(): Promise<ApiAdminAuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return {
        ok: false,
        response: apiErrorResponse({ code: "AUTH_UNAUTHORIZED", message: "Unauthorized", status: 401 }),
      };
    }

    const payload = await verifyAdminToken(token);

    if (payload.role !== "ADMIN") {
      return {
        ok: false,
        response: apiErrorResponse({ code: "AUTH_FORBIDDEN", message: "Forbidden", status: 403 }),
      };
    }

    if (!payload.sid) {
      return {
        ok: false,
        response: apiErrorResponse({ code: "AUTH_UNAUTHORIZED", message: "Unauthorized", status: 401 }),
      };
    }

    const hasActiveSession = await isAdminSessionActive(payload.sid);
    if (!hasActiveSession) {
      return {
        ok: false,
        response: apiErrorResponse({ code: "AUTH_UNAUTHORIZED", message: "Unauthorized", status: 401 }),
      };
    }

    await touchAdminSession(payload.sid);

    return { ok: true, admin: payload };
  } catch {
    return {
      ok: false,
      response: apiErrorResponse({ code: "AUTH_UNAUTHORIZED", message: "Unauthorized", status: 401 }),
    };
  }
}
