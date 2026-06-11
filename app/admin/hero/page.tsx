import { revalidatePath } from "next/cache";

import { HeroSectionManager } from "@/components/admin/hero-section-manager";
import { apiGet, apiSubmit, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
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
    <div className="max-w-screen-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Hero Section Manager</h1>
        <p className="text-sm text-muted-foreground">Edit teks, avatar, CTA, dan social link yang muncul di hero frontend.</p>
      </div>

      <HeroSectionManager action={saveHeroSectionAction} initialValues={content} />
    </div>
  );
}
