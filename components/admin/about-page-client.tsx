"use client";

import { PageTransition } from "@/components/page-transition";
import { AboutSectionManager } from "@/components/admin/about-section-manager";
import type { AboutSectionContent } from "@/lib/about-content";
import type { AboutDerivedMetrics } from "@/lib/about-stats";
import type { FormState } from "@/lib/form-state";

interface Props {
  initialValues: AboutSectionContent;
  derivedMetrics: AboutDerivedMetrics;
  saveAction: (_state: FormState, formData: FormData) => Promise<FormState>;
}

export function AdminAboutPageClient({ initialValues, derivedMetrics, saveAction }: Props) {
  return (
    <PageTransition>
      <div className="max-w-screen-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">About Section Manager</h1>
          <p className="text-sm text-muted-foreground">
            Edit teks, stats, dan skill cards yang muncul di About section frontend.
          </p>
        </div>
        <AboutSectionManager action={saveAction} initialValues={initialValues} derivedMetrics={derivedMetrics} />
      </div>
    </PageTransition>
  );
}
