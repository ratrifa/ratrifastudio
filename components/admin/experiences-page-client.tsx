"use client";

import { PageTransition } from "@/components/page-transition";
import { ExperiencesManager } from "@/components/admin/experiences-manager";
import type { ExperienceTypeValue } from "@/lib/experience-types";
import type { FormState } from "@/lib/form-state";

export interface ExperienceRecord {
  id: string;
  title: string;
  company: string;
  experienceType: ExperienceTypeValue | string | null;
  category: string | null;
  periodStart: string;
  periodEnd: string | null;
  description: string;
  photos: { id: string; imageUrl: string; caption?: string | null }[];
}

interface Props {
  experiences: ExperienceRecord[];
  createAction: (_state: FormState, formData: FormData) => Promise<FormState>;
  updateAction: (_state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (_state: FormState, formData: FormData) => Promise<FormState>;
}

export function AdminExperiencesPageClient({ experiences, createAction, updateAction, deleteAction }: Props) {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Experiences</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {experiences.length} experience{experiences.length !== 1 ? "s" : ""}
            {" · "}
            {experiences.filter((e) => !e.periodEnd).length} ongoing
          </p>
        </div>
        <ExperiencesManager
          experiences={experiences}
          createAction={createAction}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      </div>
    </PageTransition>
  );
}
