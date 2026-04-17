import { revalidatePath } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { toDbExperienceType } from "@/lib/experience-types";
import { experienceFormSchema, experienceUpdateSchema, safeDate } from "@/lib/validation";
import { ExperienceViewer } from "@/components/admin/experience-viewer";
import { CreateExperienceForm } from "@/components/admin/create-experience-form";
import { ExperienceEditItem } from "@/components/admin/experience-edit-item";
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

function isMaxConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("max_user_connections") || message.includes("exceeded the 'max_user_connections'");
}

function isPoolAcquireTimeoutError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("Timed out fetching a new connection from the connection pool");
}

function toExperienceActionError(error: unknown, fallback: string) {
  if (isMaxConnectionError(error)) {
    return "Koneksi database sedang penuh (max connections). Coba lagi beberapa saat lagi.";
  }

  if (isPoolAcquireTimeoutError(error)) {
    return "Koneksi database sedang sibuk (connection pool timeout). Coba submit lagi dalam beberapa detik.";
  }

  return error instanceof Error ? error.message : fallback;
}

async function createExperienceAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const isPresent = formData.get("isPresent") === "on";
    const periodEndValue = isPresent ? "" : String(formData.get("periodEnd") ?? "");

    const parsed = experienceFormSchema.safeParse({
      title: String(formData.get("title") ?? ""),
      company: String(formData.get("company") ?? ""),
      experienceType: String(formData.get("experienceType") ?? ""),
      periodStart: String(formData.get("periodStart") ?? ""),
      periodEnd: periodEndValue,
      description: String(formData.get("description") ?? ""),
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted experience fields.", parsed.error.flatten().fieldErrors);
    }

    const { title, company, experienceType, periodStart, periodEnd, description } = parsed.data;

    await prisma.experience.create({
      data: {
        title,
        company,
        experienceType: toDbExperienceType(experienceType),
        periodStart: safeDate(periodStart),
        periodEnd: periodEnd ? safeDate(periodEnd) : null,
        description,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    return successState("Experience created successfully.");
  } catch (error) {
    const message = toExperienceActionError(error, "Failed to create experience.");
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

async function updateExperienceAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const isPresent = formData.get("isPresent") === "on";
    const periodEndValue = isPresent ? "" : String(formData.get("periodEnd") ?? "");

    const parsed = experienceUpdateSchema.safeParse({
      id: String(formData.get("id") ?? ""),
      title: String(formData.get("title") ?? ""),
      company: String(formData.get("company") ?? ""),
      experienceType: String(formData.get("experienceType") ?? ""),
      periodStart: String(formData.get("periodStart") ?? ""),
      periodEnd: periodEndValue,
      description: String(formData.get("description") ?? ""),
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted experience fields.", parsed.error.flatten().fieldErrors);
    }

    const { id, title, company, experienceType, periodStart, periodEnd, description } = parsed.data;

    await prisma.experience.update({
      where: { id },
      data: {
        title,
        company,
        experienceType: toDbExperienceType(experienceType),
        periodStart: safeDate(periodStart),
        periodEnd: periodEnd ? safeDate(periodEnd) : null,
        description,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    return successState("Experience berhasil diupdate.");
  } catch (error) {
    const message = toExperienceActionError(error, "Update experience gagal.");
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

async function deleteExperienceAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const id = String(formData.get("id") ?? "");
    await prisma.experience.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    return successState("Experience berhasil dihapus.");
  } catch (error) {
    const message = toExperienceActionError(error, "Delete experience gagal.");
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

export default async function AdminExperiencesPage() {
  await requireAdmin();

  try {
    let experiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
    let dbWarning: string | null = null;

    try {
      experiences = await prisma.experience.findMany({
        orderBy: { periodStart: "asc" },
      });
    } catch (error) {
      if (isMaxConnectionError(error)) {
        dbWarning = "Koneksi database sedang penuh (max connections). Data experience sementara tidak bisa dimuat, tapi form tetap bisa dicoba lagi nanti.";
      } else if (isPoolAcquireTimeoutError(error)) {
        dbWarning = "Koneksi database sedang sibuk (connection pool timeout). Data experience sementara belum termuat, coba refresh lagi.";
      } else {
        throw error;
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Manage Experiences</h1>
          <p className="text-sm text-muted-foreground">CRUD pengalaman karir/organisasi.</p>
        </div>

        {dbWarning ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-amber-500">{dbWarning}</p>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Create Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateExperienceForm action={createExperienceAction} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiences Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ExperienceViewer experiences={experiences} />
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-3">
          {experiences.map((exp: (typeof experiences)[number]) => (
            <AccordionItem key={exp.id} value={exp.id} className="rounded-lg border border-border px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="min-w-0 text-left">
                  <p className="text-sm sm:text-base font-semibold truncate">{exp.title}</p>
                  <p className="text-xs text-muted-foreground">Tap to edit experience</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <ExperienceEditItem experience={exp} updateAction={updateExperienceAction} deleteAction={deleteExperienceAction} />
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
