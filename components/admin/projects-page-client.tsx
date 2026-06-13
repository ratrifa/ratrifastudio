"use client";

import { PageTransition } from "@/components/page-transition";
import { ProjectsManager } from "@/components/admin/projects-manager";
import type { FormState } from "@/lib/form-state";

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  githubUrl: string | null;
  techStack: string[];
  isPublished: boolean;
  createdAt?: string;
}

export interface ProjectViewItem {
  project_id: string;
  total_views: number;
  unique_viewers: number;
}

interface Props {
  projects: ProjectRecord[];
  viewsMap: Record<string, { total_views: number; unique_viewers: number }>;
  createAction: (_state: FormState, formData: FormData) => Promise<FormState>;
  updateAction: (_state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (_state: FormState, formData: FormData) => Promise<FormState>;
}

export function AdminProjectsPageClient({ projects, viewsMap, createAction, updateAction, deleteAction }: Props) {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
            {" · "}
            {projects.filter((p) => p.isPublished).length} published
          </p>
        </div>
        <ProjectsManager
          projects={projects}
          viewsMap={viewsMap}
          createAction={createAction}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      </div>
    </PageTransition>
  );
}
