import { revalidatePath } from "next/cache";

import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { PageTransition } from "@/components/page-transition";
import { ProjectsManager } from "@/components/admin/projects-manager";
import type { FormState } from "@/lib/form-state";

interface ProjectRecord {
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

interface ProjectViewItem {
  project_id: string;
  total_views: number;
  unique_viewers: number;
}

function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

async function createProjectAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const res = await apiSubmit("/api/projects", formData);
  const state = await toFormState(res, "Project created successfully.");
  if (state.status === "success") {
    revalidateProjects();
  }
  return state;
}

async function updateProjectAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const res = await apiSubmit(`/api/projects/${id}`, formData, "PUT");
  const state = await toFormState(res, "Project berhasil diupdate.");
  if (state.status === "success") {
    revalidateProjects();
  }
  return state;
}

async function deleteProjectAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const res = await apiFetch(`/api/projects/${id}`, { method: "DELETE", headers: { Accept: "application/json" } });
  const state = await toFormState(res, "Project berhasil dihapus.");
  if (state.status === "success") {
    revalidateProjects();
  }
  return state;
}

export default async function AdminProjectsPage() {
  await requireAdmin();

  const [projects, viewsData] = await Promise.all([
    apiGet<ProjectRecord[]>("/api/admin/projects"),
    apiGet<{ project_views: ProjectViewItem[] }>("/api/projects/views"),
  ]);

  const projectList = projects ?? [];

  const viewsMap = Object.fromEntries(
    (viewsData?.project_views ?? []).map((v) => [v.project_id, v]),
  );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projectList.length} project{projectList.length !== 1 ? "s" : ""}
            {" · "}
            {projectList.filter((p) => p.isPublished).length} published
          </p>
        </div>

        <ProjectsManager
          projects={projectList}
          viewsMap={viewsMap}
          createAction={createProjectAction}
          updateAction={updateProjectAction}
          deleteAction={deleteProjectAction}
        />
      </div>
    </PageTransition>
  );
}
