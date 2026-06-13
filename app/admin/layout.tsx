import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const isDev = process.env.NODE_ENV === "development";
  let icon: string =
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>";

  if (!isDev) {
    const hero = await apiGet<{ domainLogoUrl?: string; avatarUrl?: string }>("/api/hero");
    icon = hero?.domainLogoUrl ?? hero?.avatarUrl ?? "/images/hero-avatar.jpg";
  }

  return {
    title: isDev ? "CMS · ratrifaStudio [dev]" : "CMS · ratrifaStudio",
    icons: { icon },
  };
}

import { AdminNavbar } from "@/components/admin/admin-navbar";
import { NavigationProgress } from "@/components/admin/navigation-progress";
import { Toaster } from "@/components/ui/sonner";
import { apiFetch, apiGet } from "@/lib/api-server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { requireAdmin } from "@/lib/server-auth";

async function logoutAction() {
  "use server";

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

  const unreadData = await apiGet<{ count: number }>("/api/admin/messages/unread-count");
  const messagesUnreadCount = unreadData?.count ?? 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavigationProgress />
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="min-w-0 truncate font-semibold">Portfolio CMS</p>
          <AdminNavbar logoutAction={logoutAction} messagesUnreadCount={messagesUnreadCount} />
        </div>
      </header>
      <section className="w-full px-4 py-6 sm:px-6 sm:py-8">{children}</section>
      <Toaster richColors position="top-right" />
    </main>
  );
}
