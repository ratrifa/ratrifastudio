/**
 * Project Detail Page
 * Dynamic route untuk menampilkan project detail dengan GitHub commit history.
 * Data project diambil dari Laravel API; commit history tetap diambil langsung
 * dari GitHub API (stateless, pakai server token — tidak menyentuh database).
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { apiGet } from "@/lib/api-server";
import { PageTransition } from "@/components/page-transition";
import { fetchRepositoryCommits } from "@/lib/github-api";
import type { Commit } from "@/lib/commit-types";
import { ProjectDetailHeader } from "@/components/project-detail-header";
import { ProjectDetailLinks } from "@/components/project-detail-links";
import { ProjectDetailTechstack } from "@/components/project-detail-techstack";
import { CommitHistoryViewer } from "@/components/commit-history-viewer";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await apiGet<ProjectApi>(`/api/projects/${id}`);

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

  const project = await apiGet<ProjectApi>(`/api/projects/${id}`);

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
    <div className="min-h-screen py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back link */}
        <div className="mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Projects
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
              <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 sm:p-8 text-center">
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
