import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

export const AUTH_COOKIE_NAME = "rf_admin_token";
export const AUTH_LOGIN_PATH = "/backdoor-entry";

export interface AdminAuthPayload extends JWTPayload {
  sub: string;
  email: string;
  role: "ADMIN";
  sid: string;
}

const encoder = new TextEncoder();

function getAuthSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is required");
  }
  return encoder.encode(value);
}

export async function createAdminToken(payload: AdminAuthPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(getAuthSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify<AdminAuthPayload>(token, getAuthSecret());
  return payload;
}
