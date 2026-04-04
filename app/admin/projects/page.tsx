import { revalidatePath } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { deleteLocalUpload, saveImageUpload } from "@/lib/storage";
import { projectFormSchema, projectUpdateSchema, toTechStack } from "@/lib/validation";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { ProjectViewer } from "@/components/admin/project-viewer";
import { CreateProjectForm } from "@/components/admin/create-project-form";
import { ProjectEditItem } from "@/components/admin/project-edit-item";
import type { FormState } from "@/lib/form-state";

const errorState = (message: string, fieldErrors?: Record<string, string[] | undefined>): FormState => ({
  status: "error",
  message,
  fieldErrors,
});

const successState = (message: string): FormState => ({
  status: "success",
  message,
});

async function createProjectAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const parsed = projectFormSchema.safeParse({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      link: String(formData.get("link") ?? ""),
      githubUrl: String(formData.get("githubUrl") ?? ""),
      techStackRaw: String(formData.get("techStackRaw") ?? ""),
      isPublished: formData.get("isPublished") === "on",
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted project fields.", parsed.error.flatten().fieldErrors);
    }

    const { title, description, link, githubUrl, techStackRaw, isPublished } = parsed.data;
    const uploadedImage = await saveImageUpload(formData.get("imageFile"), "projects");
    const techStack = toTechStack(techStackRaw);

    await prisma.project.create({
      data: {
        title,
        description,
        imageUrl: uploadedImage,
        link,
        githubUrl,
        techStack,
        isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successState("Project created successfully.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

async function updateProjectAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const parsed = projectUpdateSchema.safeParse({
      id: String(formData.get("id") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      link: String(formData.get("link") ?? ""),
      githubUrl: String(formData.get("githubUrl") ?? ""),
      techStackRaw: String(formData.get("techStackRaw") ?? ""),
      isPublished: formData.get("isPublished") === "on",
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted project fields.", parsed.error.flatten().fieldErrors);
    }

    const { id, title, description, link, githubUrl, techStackRaw, isPublished } = parsed.data;
    const current = await prisma.project.findUnique({ where: { id } });
    if (!current) {
      return errorState("Project tidak ditemukan.");
    }

    const uploadedImage = await saveImageUpload(formData.get("imageFile"), "projects");
    const nextImage = uploadedImage ?? current.imageUrl;

    if (uploadedImage && current.imageUrl !== uploadedImage) {
      await deleteLocalUpload(current.imageUrl);
    }

    const techStack = toTechStack(techStackRaw);

    await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl: nextImage,
        link,
        githubUrl,
        techStack,
        isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successState("Project berhasil diupdate.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update project gagal.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

async function deleteProjectAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const current = await prisma.project.findUnique({ where: { id } });
    if (!current) {
      return errorState("Project tidak ditemukan.");
    }

    await deleteLocalUpload(current.imageUrl);
    await prisma.project.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successState("Project berhasil dihapus.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete project gagal.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

export default async function AdminProjectsPage() {
  await requireAdmin();

  try {
    const projects: Awaited<ReturnType<typeof prisma.project.findMany>> = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return (
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
          {projects.map((project: (typeof projects)[number]) => (
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
    );
  } finally {
    await cleanupPrisma();
  }
}
