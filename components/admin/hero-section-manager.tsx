"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSection } from "@/components/hero-section";
import { CreateHeroForm } from "@/components/admin/create-hero-form";
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
    <div className="flex flex-col gap-6">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Frontend-Exact Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <HeroSection content={previewContent} previewAsBanner />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateHeroForm action={action} values={formValues} onValuesChange={setFormValues} />
        </CardContent>
      </Card>
    </div>
  );
}
