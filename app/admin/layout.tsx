import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminNavbar } from "@/components/admin/admin-navbar";
import { NavigationProgress } from "@/components/admin/navigation-progress";
import { Toaster } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { requireAdmin } from "@/lib/server-auth";

async function logoutAction() {
  "use server";

  // Revoke the session in Laravel (best-effort), then delete the cookie on this
  // origin. The cookie is host-only `localhost`, shared across ports, so this
  // reliably clears it without depending on cross-origin Set-Cookie handling.
  try {
    await apiFetch("/api/auth/logout", { method: "POST", headers: { Accept: "application/json" } });
  } catch {
    // Ignore network errors and continue clearing the local session.
  }

  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

  redirect("/backdoor-entry");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavigationProgress />
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="min-w-0 truncate font-semibold">Portfolio CMS</p>
          <AdminNavbar logoutAction={logoutAction} />
        </div>
      </header>
      <section className="w-full px-4 sm:px-6 py-6 sm:py-8">{children}</section>
      <Toaster richColors position="top-right" />
    </main>
  );
}
