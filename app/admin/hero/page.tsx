import { revalidatePath } from "next/cache";

import { apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { AdminHeroPageClient } from "@/components/admin/hero-page-client";
import { defaultHeroContent, type HeroSectionContent } from "@/lib/hero-content";
import type { FormState } from "@/lib/form-state";

async function saveHeroSectionAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const res = await apiSubmit("/api/hero", formData, "PUT");
  const state = await toFormState(res, "Hero section saved successfully.");
  if (state.status === "success") {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/hero");
  }
  return state;
}

export default async function AdminHeroPage() {
  await requireAdmin();

  const content = (await apiGet<HeroSectionContent>("/api/hero")) ?? defaultHeroContent;

  return (
    <AdminHeroPageClient
      initialValues={content}
      saveAction={saveHeroSectionAction}
    />
  );
}
