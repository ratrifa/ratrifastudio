import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
