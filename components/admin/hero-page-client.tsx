"use client";

import { PageTransition } from "@/components/page-transition";
import { HeroSectionManager } from "@/components/admin/hero-section-manager";
import type { HeroSectionContent } from "@/lib/hero-content";
import type { FormState } from "@/lib/form-state";

interface Props {
  initialValues: HeroSectionContent;
  saveAction: (_state: FormState, formData: FormData) => Promise<FormState>;
}

export function AdminHeroPageClient({ initialValues, saveAction }: Props) {
  return (
    <PageTransition>
      <div className="max-w-screen-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hero Section Manager</h1>
          <p className="text-sm text-muted-foreground">
            Edit teks, avatar, CTA, dan social link yang muncul di hero frontend.
          </p>
        </div>
        <HeroSectionManager action={saveAction} initialValues={initialValues} />
      </div>
    </PageTransition>
  );
}
