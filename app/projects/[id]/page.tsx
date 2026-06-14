/**
 * Project Detail Page
 * Dynamic route untuk menampilkan project detail dengan GitHub commit history.
 * Data project diambil dari Laravel API; commit history tetap diambil langsung
 * dari GitHub API (stateless, pakai server token — tidak menyentuh database).
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cacheLife } from "next/cache";
import { API_BASE_URL } from "@/lib/api";
import { PageTransition } from "@/components/page-transition";
import { fetchRepositoryCommits } from "@/lib/github-api";
import type { Commit } from "@/lib/commit-types";
import { ProjectDetailHeader } from "@/components/project-detail-header";
import { ProjectDetailLinks } from "@/components/project-detail-links";
import { ProjectDetailTechstack } from "@/components/project-detail-techstack";
import { CommitHistoryViewer } from "@/components/commit-history-viewer";
import { TrackVisit } from "@/components/track-visit";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ProjectApi {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  link: string | null;
  githubUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchProject(id: string): Promise<ProjectApi | null> {
  "use cache";
  cacheLife({ revalidate: 60, stale: 300 });
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return (await res.json()) as ProjectApi;
  } catch {}
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProject(id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const project = await fetchProject(id);

  if (!project) {
    notFound();
  }

  let commits: Commit[] = [];
  let commitError: string | undefined;
  let totalCommits = 0;

  if (project.githubUrl) {
    const result = await fetchRepositoryCommits(project.githubUrl, 100, "ratrifa");

    if (result.success && result.commits) {
      commits = result.commits;
      totalCommits = result.totalCount || 0;
    } else {
      commitError = result.error;
    }
  }

  const techStack = Array.isArray(project.techStack) ? project.techStack : [];

  return (
    <PageTransition>
    <TrackVisit path={`/projects/${id}`} />
    <div className="min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Back link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
          <div className="space-y-8 min-w-0">
            <section>
              <ProjectDetailHeader
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl ?? ""}
                createdAt={new Date(project.createdAt)}
                updatedAt={project.updatedAt ? new Date(project.updatedAt) : undefined}
              />
            </section>

            <section className="pb-8 border-b border-border">
              <ProjectDetailLinks demoUrl={project.link ?? ""} githubUrl={project.githubUrl ?? ""} isPrivateRepo={project.githubUrl?.includes("private") || false} />
            </section>

            {techStack.length > 0 && (
              <section className="pb-8 border-b border-border">
                <ProjectDetailTechstack techStack={techStack} />
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-8 h-fit">
            {project.githubUrl && <CommitHistoryViewer commits={commits} error={commitError} repoUrl={project.githubUrl} totalCommits={totalCommits} />}

            {!project.githubUrl && (
              <div className="rounded-xl border border-dashed border-border bg-muted/50 p-6 sm:p-8 text-center">
                <p className="text-sm text-muted-foreground">GitHub repository tidak dikonfigurasi untuk project ini.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
