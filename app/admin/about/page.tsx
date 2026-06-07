import { revalidatePath } from "next/cache";

import { AboutSectionManager } from "@/components/admin/about-section-manager";
import type { FormState } from "@/lib/form-state";
import { apiFetch, apiGet, toFormState } from "@/lib/api-server";
import { requireAdmin } from "@/lib/server-auth";
import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";
import type { AboutDerivedMetrics } from "@/lib/about-stats";

type AboutResponse = AboutSectionContent & { derivedMetrics: AboutDerivedMetrics };

const FALLBACK_METRICS: AboutDerivedMetrics = {
  experienceValue: defaultAboutContent.stats[0]?.value ?? "1+",
  projectValue: defaultAboutContent.stats[1]?.value ?? "0+",
};

async function saveAboutSectionAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  await requireAdmin();

  const statLabels = formData.getAll("statLabel").map((value) => String(value).trim());
  const statValues = formData.getAll("statValue").map((value) => String(value).trim());
  const stats = statLabels
    .map((label, index) => ({ label, value: statValues[index] ?? "" }))
    .filter((stat) => stat.label && stat.value);

  const skillTitles = formData.getAll("skillTitle").map((value) => String(value).trim());
  const skillIcons = formData.getAll("skillIcon").map((value) => String(value).trim());
  const skillItemsRaw = formData.getAll("skillItemsRaw").map((value) => String(value).trim());
  const skills = skillTitles
    .map((title, index) => ({ title, icon: skillIcons[index] ?? "", itemsRaw: skillItemsRaw[index] ?? "" }))
    .filter((skill) => skill.title);

  const res = await apiFetch("/api/about", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      headline: String(formData.get("headline") ?? ""),
      paragraph: String(formData.get("paragraph") ?? ""),
      stats,
      skills,
    }),
  });

  const state = await toFormState(res, "About section saved successfully.");
  if (state.status === "success") {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/about");
  }
  return state;
}

export default async function AdminAboutPage() {
  await requireAdmin();

  const content = await apiGet<AboutResponse>("/api/about");
  const initialValues: AboutSectionContent = content ?? defaultAboutContent;
  const derivedMetrics = content?.derivedMetrics ?? FALLBACK_METRICS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">About Section Manager</h1>
        <p className="text-sm text-muted-foreground">Edit teks, stats, dan skill cards yang muncul di About section frontend.</p>
      </div>

      <AboutSectionManager action={saveAboutSectionAction} initialValues={initialValues} derivedMetrics={derivedMetrics} />
    </div>
  );
}
