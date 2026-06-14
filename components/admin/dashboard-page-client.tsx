"use client";

import { Award, Briefcase, ChevronRight, ImageIcon, LayoutGrid, UserRound } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/page-transition";
import { VisitAnalyticsCard } from "@/components/admin/visit-charts";
import type { DailyVisit, TopPage } from "@/components/admin/visit-charts";

interface VisitSummary {
  total_visits: number;
  unique_visitors: number;
  visits_today: number;
  visits_this_month: number;
  top_pages: TopPage[];
}

interface Props {
  projectCount: number;
  experienceCount: number;
  certificateCount: number;
  visitSummary: VisitSummary | null;
  dailyVisits: DailyVisit[];
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-border" />
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </p>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AdminDashboardPageClient({
  projectCount,
  experienceCount,
  certificateCount,
  visitSummary,
  dailyVisits,
}: Props) {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Kelola semua konten portfolio.</p>
        </div>

        {/* Page Sections */}
        <div className="space-y-4">
          <SectionLabel>Page Sections</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/hero" className="group block">
              <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-sm cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-primary/10 p-2.5 shrink-0 group-hover:bg-primary/15 transition-colors">
                    <ImageIcon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Hero Section</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Avatar, headline, CTA, dan social links.
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/about" className="group block">
              <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-sm cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-violet-500/10 p-2.5 shrink-0 group-hover:bg-violet-500/15 transition-colors">
                    <UserRound size={18} className="text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">About Section</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Narasi, statistik, dan skill cards.
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground/40 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Content Stats */}
        <div className="space-y-4">
          <SectionLabel>Content</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/admin/projects" className="group block">
              <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-sm cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl font-bold tabular-nums">{projectCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Projects</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/15 transition-colors">
                      <LayoutGrid size={16} className="text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/experiences" className="group block">
              <Card className="transition-all duration-200 hover:border-sky-500/50 hover:shadow-sm cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl font-bold tabular-nums">{experienceCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Experiences</p>
                    </div>
                    <div className="rounded-lg bg-sky-500/10 p-2.5 group-hover:bg-sky-500/15 transition-colors">
                      <Briefcase size={16} className="text-sky-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/certificates" className="group block">
              <Card className="transition-all duration-200 hover:border-amber-500/50 hover:shadow-sm cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl font-bold tabular-nums">{certificateCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Certificates</p>
                    </div>
                    <div className="rounded-lg bg-amber-500/10 p-2.5 group-hover:bg-amber-500/15 transition-colors">
                      <Award size={16} className="text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Website Visits */}
        {visitSummary && (
          <div className="space-y-4">
            <SectionLabel>Website Visits</SectionLabel>
            <VisitAnalyticsCard
              visitsToday={visitSummary.visits_today}
              visitsThisMonth={visitSummary.visits_this_month}
              totalVisits={visitSummary.total_visits}
              uniqueVisitors={visitSummary.unique_visitors}
              dailyVisits={dailyVisits}
              topPages={visitSummary.top_pages}
            />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
