/**
 * Base URL of the Laravel backend API (`ratrifastudio-api`).
 *
 * The backend was extracted from this Next.js app into a standalone Laravel
 * service. Browser-side calls must target this absolute URL and include
 * credentials so the `rf_admin_token` cookie travels cross-origin.
 *
 * Configure via `NEXT_PUBLIC_API_URL` (e.g. https://api.ratrifa.studio).
 * Falls back to the local Laravel dev server.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Build an absolute URL to an API endpoint.
 *
 * @param path Path beginning with a slash, e.g. `/api/experiences`.
 */
export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
