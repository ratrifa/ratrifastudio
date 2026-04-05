import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAdminSessionActive, touchAdminSession } from "@/lib/admin-session";
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
