import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/page-transition";
import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [projects, experiences, certificates] = await Promise.all([
    apiGet<unknown[]>("/api/admin/projects"),
    apiGet<unknown[]>("/api/experiences"),
    apiGet<unknown[]>("/api/certificates"),
  ]);

  const projectCount = projects?.length ?? 0;
  const experienceCount = experiences?.length ?? 0;
  const certificateCount = certificates?.length ?? 0;

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Ringkasan konten portfolio yang terdaftar.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Edit konten hero frontend, avatar, CTA, dan social link.</p>
            <Link href="/admin/hero" className="text-sm font-medium text-primary hover:underline">
              Open hero manager
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Edit narasi, statistik, dan skill cards yang tampil di section About.</p>
            <Link href="/admin/about" className="text-sm font-medium text-primary hover:underline">
              Open about manager
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{experienceCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{certificateCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageTransition>
  );
}
