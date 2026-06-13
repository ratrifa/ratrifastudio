import { revalidatePath } from "next/cache";

import { apiFetch, apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { AdminExperiencesPageClient, type ExperienceRecord } from "@/components/admin/experiences-page-client";
import type { FormState } from "@/lib/form-state";

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
    <AdminExperiencesPageClient
      experiences={experiences}
      createAction={createExperienceAction}
      updateAction={updateExperienceAction}
      deleteAction={deleteExperienceAction}
    />
  );
}
