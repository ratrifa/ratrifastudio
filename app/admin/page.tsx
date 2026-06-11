import { Award, Briefcase, ImageIcon, LayoutGrid, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { VisitAnalyticsCard } from "@/components/admin/visit-charts";
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

  const projectCount = projects?.length ?? 0;
  const experienceCount = experiences?.length ?? 0;
  const certificateCount = certificates?.length ?? 0;

  const sv = visitSummary;
  const dailyVisits = dailyData?.daily_visits ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola semua konten portfolio.</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Page Sections
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="hover:border-primary/40 transition-colors">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="mt-0.5 rounded-md bg-muted p-2 shrink-0">
                <ImageIcon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Hero Section</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                  Avatar, headline, CTA, dan social links.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/hero">Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 transition-colors">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="mt-0.5 rounded-md bg-muted p-2 shrink-0">
                <UserRound size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">About Section</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                  Narasi, statistik, dan skill cards.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/about">Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Content
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/admin/projects" className="group block">
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-2xl font-bold">{projectCount}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Projects</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <LayoutGrid size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/experiences" className="group block">
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-2xl font-bold">{experienceCount}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Experiences</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <Briefcase size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/certificates" className="group block">
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-2xl font-bold">{certificateCount}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Certificates</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <Award size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {sv && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Website Visits
          </p>
          <VisitAnalyticsCard
            visitsToday={sv.visits_today}
            visitsThisMonth={sv.visits_this_month}
            totalVisits={sv.total_visits}
            uniqueVisitors={sv.unique_visitors}
            dailyVisits={dailyVisits}
            topPages={sv.top_pages}
          />
        </div>
      )}
    </div>
  );
}
