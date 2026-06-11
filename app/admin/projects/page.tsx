import { revalidatePath } from "next/cache";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { PageTransition } from "@/components/page-transition";
import { CollapsibleCreate } from "@/components/admin/collapsible-create";
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
          <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
            {" · "}
            {projects.filter((p) => p.isPublished).length} published
          </p>
        </div>

        <CollapsibleCreate label="New Project">
          <CreateProjectForm action={createProjectAction} />
        </CollapsibleCreate>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectViewer projects={projects} />
          </CardContent>
        </Card>

        {projects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <p className="text-xs font-medium text-muted-foreground shrink-0">Edit items</p>
              <Separator className="flex-1" />
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {projects.map((project) => (
                <AccordionItem
                  key={project.id}
                  value={project.id}
                  className="rounded-lg border border-border px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5 mr-2">
                      <span className="text-sm font-semibold truncate">{project.title}</span>
                      <Badge
                        variant={project.isPublished ? "default" : "outline"}
                        className="shrink-0 text-xs"
                      >
                        {project.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <ProjectEditItem
                      project={project}
                      updateAction={updateProjectAction}
                      deleteAction={deleteProjectAction}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
