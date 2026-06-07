import "server-only";

import { cookies } from "next/headers";

import { API_BASE_URL } from "@/lib/api";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import type { FormState } from "@/lib/form-state";

/**
 * Server-side fetch to the Laravel API that forwards the admin's
 * `rf_admin_token` cookie so authenticated endpoints accept the request.
 * Always uncached — these calls back admin mutations and fresh reads.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Cookie", `${AUTH_COOKIE_NAME}=${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, { ...init, headers, cache: "no-store" });
}

/**
 * GET JSON from the API. Returns `null` on any failure so server components can
 * degrade gracefully instead of throwing.
 */
export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await apiFetch(path, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Submit a multipart form to the API. PUT is method-spoofed over POST because
 * PHP does not parse multipart bodies on native PUT requests.
 *
 * Two file quirks are normalised while rebuilding the body:
 *  - Empty file inputs (unselected `<input type="file">`) arrive as zero-byte
 *    files and are dropped so optional fields validate as simply absent.
 *  - A forwarded file can lose its name (blank filename), which the backend
 *    rejects as "not a file"; a non-empty filename is always supplied so the
 *    server can still content-sniff the type.
 */
export async function apiSubmit(path: string, formData: FormData, method: "POST" | "PUT" = "POST"): Promise<Response> {
  const body = new FormData();
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size === 0) {
        continue;
      }
      body.append(key, value, value.name && value.name.length > 0 ? value.name : "upload");
    } else {
      body.append(key, value);
    }
  }

  if (method === "PUT") {
    body.set("_method", "PUT");
  }

  return apiFetch(path, { method: "POST", body, headers: { Accept: "application/json" } });
}

/**
 * Map an API response into the `FormState` shape consumed by admin forms.
 * Field-level validation errors share the same `{ field: string[] }` shape on
 * both sides, so they pass through unchanged.
 */
export async function toFormState(res: Response, successMessage: string): Promise<FormState> {
  if (res.ok) {
    return { status: "success", message: successMessage };
  }

  let body: { message?: string; details?: { fieldErrors?: Record<string, string[] | undefined> } } | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (res.status === 422 && body?.details?.fieldErrors) {
    return {
      status: "error",
      message: body.message ?? "Please fix the highlighted fields.",
      fieldErrors: body.details.fieldErrors,
    };
  }

  if (res.status === 401) {
    return { status: "session_expired", message: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  return { status: "error", message: body?.message ?? "Request gagal. Coba lagi." };
}
