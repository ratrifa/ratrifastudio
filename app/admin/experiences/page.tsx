import { revalidatePath } from "next/cache";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import type { ExperienceTypeValue } from "@/lib/experience-types";
import { PageTransition } from "@/components/page-transition";
import { CollapsibleCreate } from "@/components/admin/collapsible-create";
import { ExperienceViewer } from "@/components/admin/experience-viewer";
import { CreateExperienceForm } from "@/components/admin/create-experience-form";
import { ExperienceEditItem } from "@/components/admin/experience-edit-item";
import type { FormState } from "@/lib/form-state";

interface ExperienceRecord {
  id: string;
  title: string;
  company: string;
  experienceType: ExperienceTypeValue | string | null;
  periodStart: string;
  periodEnd: string | null;
  description: string;
  photos: { id: string; imageUrl: string; caption?: string | null }[];
}

function revalidateExperiences() {
  revalidatePath("/");
  revalidatePath("/admin/experiences");
}

function normalizePeriodEnd(formData: FormData) {
  if (formData.get("isPresent") === "on") {
    formData.delete("periodEnd");
  }
  formData.delete("isPresent");
}

async function createExperienceAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();
  normalizePeriodEnd(formData);

  const res = await apiSubmit("/api/experiences", formData);
  const state = await toFormState(res, "Experience created successfully.");
  if (state.status === "success") {
    revalidateExperiences();
  }
  return state;
}

async function updateExperienceAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();
  normalizePeriodEnd(formData);

  const id = String(formData.get("id") ?? "");
  const res = await apiSubmit(`/api/experiences/${id}`, formData, "PUT");
  const state = await toFormState(res, "Experience berhasil diupdate.");
  if (state.status === "success") {
    revalidateExperiences();
  }
  return state;
}

async function deleteExperienceAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const res = await apiFetch(`/api/experiences/${id}`, { method: "DELETE", headers: { Accept: "application/json" } });
  const state = await toFormState(res, "Experience berhasil dihapus.");
  if (state.status === "success") {
    revalidateExperiences();
  }
  return state;
}

export default async function AdminExperiencesPage() {
  await requireAdmin();

  const experiences = (await apiGet<ExperienceRecord[]>("/api/experiences")) ?? [];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Experiences</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {experiences.length} experience{experiences.length !== 1 ? "s" : ""}
            {" · "}
            {experiences.filter((e) => !e.periodEnd).length} ongoing
          </p>
        </div>

        <CollapsibleCreate label="New Experience">
          <CreateExperienceForm action={createExperienceAction} />
        </CollapsibleCreate>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <ExperienceViewer experiences={experiences} />
          </CardContent>
        </Card>

        {experiences.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <p className="text-xs font-medium text-muted-foreground shrink-0">Edit items</p>
              <Separator className="flex-1" />
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {experiences.map((exp) => (
                <AccordionItem
                  key={exp.id}
                  value={exp.id}
                  className="rounded-lg border border-border px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="min-w-0 mr-2 text-left">
                      <p className="text-sm font-semibold truncate">{exp.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {exp.company}
                        {!exp.periodEnd && (
                          <span className="ml-1.5 text-primary font-medium">· Ongoing</span>
                        )}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <ExperienceEditItem
                      experience={exp}
                      updateAction={updateExperienceAction}
                      deleteAction={deleteExperienceAction}
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
