import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/api-error";
import { AUTH_COOKIE_NAME, AUTH_LOGIN_PATH, verifyAdminToken } from "@/lib/auth";

/**
 * Resolve the current admin from the `rf_admin_token` cookie.
 *
 * The backend now lives in the Laravel API (`ratrifastudio-api`), so this app
 * holds no database. Authentication is established by verifying the JWT
 * signature and expiry locally with the shared `AUTH_SECRET` — purely to gate
 * which UI is rendered. Every state-changing action is independently
 * authorised by the Laravel API, which checks the session is still active.
 */
export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return null;
    }

    const payload = await verifyAdminToken(token);
    if (payload.role !== "ADMIN" || !payload.sid) {
      return null;
    }

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
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      ok: false,
      response: apiErrorResponse({ code: "AUTH_UNAUTHORIZED", message: "Unauthorized", status: 401 }),
    };
  }

  return { ok: true, admin };
}
