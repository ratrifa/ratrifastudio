import { revalidatePath } from "next/cache";

import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { AdminProjectsPageClient, type ProjectRecord, type ProjectViewItem } from "@/components/admin/projects-page-client";
import type { FormState } from "@/lib/form-state";

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
    <AdminProjectsPageClient
      projects={projectList}
      viewsMap={viewsMap}
      createAction={createProjectAction}
      updateAction={updateProjectAction}
      deleteAction={deleteProjectAction}
    />
  );
}
