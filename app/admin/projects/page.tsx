import { revalidatePath } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { PageTransition } from "@/components/page-transition";
import { ProjectViewer } from "@/components/admin/project-viewer";
import { CreateProjectForm } from "@/components/admin/create-project-form";
import { ProjectEditItem } from "@/components/admin/project-edit-item";
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

  const projects = (await apiGet<ProjectRecord[]>("/api/admin/projects")) ?? [];

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Manage Projects</h1>
        <p className="text-sm text-muted-foreground">CRUD proyek untuk halaman portfolio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProjectForm action={createProjectAction} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectViewer projects={projects} />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-3">
        {projects.map((project) => (
          <AccordionItem key={project.id} value={project.id} className="rounded-lg border border-border px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="min-w-0 text-left">
                <p className="text-sm sm:text-base font-semibold truncate">{project.title}</p>
                <p className="text-xs text-muted-foreground">Tap to edit project</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <ProjectEditItem project={project} updateAction={updateProjectAction} deleteAction={deleteProjectAction} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    </PageTransition>
  );
}
