"use client";

import { useMemo, useState } from "react";

import { AboutSection } from "@/components/about-section";
import { CreateAboutForm, type AboutSectionFormValues } from "@/components/admin/create-about-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AboutSectionContent } from "@/lib/about-content";
import { isDerivedStatLabel, type AboutDerivedMetrics } from "@/lib/about-stats";
import type { FormState } from "@/lib/form-state";

interface AboutSectionManagerProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: AboutSectionContent;
  derivedMetrics: AboutDerivedMetrics;
}

function toFormValues(content: AboutSectionContent): AboutSectionFormValues {
  return {
    headline: content.headline,
    paragraph: content.paragraph,
    stats: content.stats.filter((stat) => !isDerivedStatLabel(stat.label)),
    skills: content.skills.map((skill) => ({
      title: skill.title,
      icon: skill.icon,
      itemsRaw: skill.items.join(", "),
    })),
  };
}

function toPreviewContent(values: AboutSectionFormValues, derivedMetrics: AboutDerivedMetrics): AboutSectionContent {
  return {
    headline: values.headline,
    paragraph: values.paragraph,
    stats: [{ label: "Years Exp.", value: derivedMetrics.experienceValue }, { label: "Projects", value: derivedMetrics.projectValue }, ...values.stats],
    skills: values.skills
      .map((skill) => ({
        title: skill.title,
        icon: skill.icon,
        items: skill.itemsRaw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }))
      .filter((skill) => skill.title && skill.items.length > 0),
  };
}

export function AboutSectionManager({ action, initialValues, derivedMetrics }: AboutSectionManagerProps) {
  const [formValues, setFormValues] = useState<AboutSectionFormValues>(() => toFormValues(initialValues));

  const previewContent = useMemo(() => toPreviewContent(formValues, derivedMetrics), [derivedMetrics, formValues]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Frontend-Exact Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AboutSection content={previewContent} previewAsBanner />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>About Content</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateAboutForm action={action} values={formValues} onValuesChange={setFormValues} />
        </CardContent>
      </Card>
    </div>
  );
}
