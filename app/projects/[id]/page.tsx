/**
 * Project Detail Page
 * Dynamic route untuk menampilkan project detail dengan GitHub commit history
 */

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fetchRepositoryCommits } from "@/lib/github-api";
import { ProjectDetailHeader } from "@/components/project-detail-header";
import { ProjectDetailLinks } from "@/components/project-detail-links";
import { ProjectDetailTechstack } from "@/components/project-detail-techstack";
import { CommitHistoryViewer } from "@/components/commit-history-viewer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate metadata untuk SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return {
        title: "Project Not Found",
      };
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
  } catch (error) {
    return {
      title: "Project",
    };
  }
}

/**
 * Main component
 */
export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    // Fetch project data
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      notFound();
    }

    // Initialize variables
    let commits = [];
    let commitError: string | undefined;
    let totalCommits = 0;

    // Fetch commits jika githubUrl tersedia
    if (project.githubUrl) {
      const result = await fetchRepositoryCommits(project.githubUrl, 100, "ratrifa");

      if (result.success && result.commits) {
        commits = result.commits;
        totalCommits = result.totalCount || 0;
      } else {
        commitError = result.error;
      }
    }

    // Parse techStack - bisa JSON string atau array
    let techStack: string[] = [];
    if (project.techStack) {
      if (typeof project.techStack === "string") {
        try {
          techStack = JSON.parse(project.techStack);
        } catch {
          techStack = [];
        }
      } else if (Array.isArray(project.techStack)) {
        techStack = project.techStack;
      }
    }

    return (
      <div className="min-h-screen py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Back link */}
          <div className="mb-6 sm:mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Projects
            </a>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
            <div className="space-y-8 min-w-0">
              {/* Header Section */}
              <section>
                <ProjectDetailHeader
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                />
              </section>

              {/* Links Section */}
              <section className="pb-8 border-b border-border">
                <ProjectDetailLinks
                  demoUrl={project.link}
                  githubUrl={project.githubUrl}
                  isPrivateRepo={project.githubUrl?.includes("private") || false}
                />
              </section>

              {/* Tech Stack Section */}
              {techStack.length > 0 && (
                <section className="pb-8 border-b border-border">
                  <ProjectDetailTechstack techStack={techStack} />
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-8 h-fit">
              {/* Commit History Section */}
              {project.githubUrl && (
                <CommitHistoryViewer
                  commits={commits}
                  error={commitError}
                  repoUrl={project.githubUrl}
                  totalCommits={totalCommits}
                />
              )}

              {/* No GitHub URL message */}
              {!project.githubUrl && (
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 sm:p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    GitHub repository tidak dikonfigurasi untuk project ini.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[ProjectDetail] Error:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground">
            Failed to load project details. Please try again later.
          </p>
          <a href="/" className="text-primary hover:underline text-sm">
            ← Back to home
          </a>
        </div>
      </div>
    );
  }
}
