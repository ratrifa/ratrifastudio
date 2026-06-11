"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSection } from "@/components/hero-section";
import { CreateHeroForm } from "@/components/admin/create-hero-form";
import { ScaledPreview } from "@/components/admin/scaled-preview";
import type { HeroSectionContent } from "@/lib/hero-content";
import type { FormState } from "@/lib/form-state";

type HeroSectionFormValues = HeroSectionContent & {
  techTagsRaw: string;
};

interface HeroSectionManagerProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: HeroSectionContent;
}

function toFormValues(content: HeroSectionContent): HeroSectionFormValues {
  return {
    ...content,
    techTagsRaw: content.techTags.join(", "),
  };
}

function toPreviewContent(values: HeroSectionFormValues): HeroSectionContent {
  return {
    headline: values.headline,
    description: values.description,
    name: values.name,
    role: values.role,
    domainLabel: values.domainLabel,
    domainLogoUrl: values.domainLogoUrl,
    techTags: values.techTagsRaw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    cvUrl: values.cvUrl,
    avatarUrl: values.avatarUrl,
    avatarAlt: values.avatarAlt,
    githubUrl: values.githubUrl,
    linkedinUrl: values.linkedinUrl,
    twitterUrl: values.twitterUrl,
    statusBadgeDetail: values.statusBadgeDetail,
    openToWork: values.openToWork,
  };
}

export function HeroSectionManager({ action, initialValues }: HeroSectionManagerProps) {
  const [formValues, setFormValues] = useState<HeroSectionFormValues>(() => toFormValues(initialValues));
  const previewContent = useMemo(() => toPreviewContent(formValues), [formValues]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[2fr_3fr] lg:items-start">
      {/* Form — left on desktop, top on mobile */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateHeroForm action={action} values={formValues} onValuesChange={setFormValues} />
        </CardContent>
      </Card>

      {/* Preview — right on desktop (sticky), bottom on mobile */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Card className="overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-border">
            <CardTitle className="text-sm font-medium text-muted-foreground">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScaledPreview>
              <HeroSection content={previewContent} previewAsBanner />
            </ScaledPreview>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
