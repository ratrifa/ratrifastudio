import { apiGet } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { AdminDashboardPageClient } from "@/components/admin/dashboard-page-client";
import type { DailyVisit, TopPage } from "@/components/admin/visit-charts";

interface VisitSummary {
  total_visits: number;
  unique_visitors: number;
  visits_today: number;
  visits_this_month: number;
  top_pages: TopPage[];
}

interface DailyData {
  daily_visits: DailyVisit[];
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [projects, experiences, certificates, visitSummary, dailyData] = await Promise.all([
    apiGet<unknown[]>("/api/admin/projects"),
    apiGet<unknown[]>("/api/experiences"),
    apiGet<unknown[]>("/api/certificates"),
    apiGet<VisitSummary>("/api/visits/summary"),
    apiGet<DailyData>("/api/visits/daily?days=30"),
  ]);

  return (
    <AdminDashboardPageClient
      projectCount={projects?.length ?? 0}
      experienceCount={experiences?.length ?? 0}
      certificateCount={certificates?.length ?? 0}
      visitSummary={visitSummary ?? null}
      dailyVisits={dailyData?.daily_visits ?? []}
    />
  );
}
