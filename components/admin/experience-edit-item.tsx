"use client";

import { useActionState, useState } from "react";

import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { PresentEndDateField } from "@/components/admin/present-end-date-field";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EXPERIENCE_TYPE_LABELS, EXPERIENCE_TYPE_OPTIONS, normalizeExperienceType, type ExperienceTypeValue } from "@/lib/experience-types";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface ExperienceEditItemProps {
  experience: {
    id: string;
    title: string;
    company: string;
    experienceType?: ExperienceTypeValue | string | null;
    periodStart: Date | string;
    periodEnd: Date | string | null;
    description: string;
  };
  updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

function toDateInputValue(value: Date | string | null) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

export function ExperienceEditItem({ experience, updateAction, deleteAction }: ExperienceEditItemProps) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialFormState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialFormState);
  const defaultExperienceType = normalizeExperienceType(experience.experienceType) ?? "full-time";
  const [experienceType, setExperienceType] = useState<ExperienceTypeValue>(defaultExperienceType);

  return (
    <div className="space-y-3">
      <FormStateAlert state={updateState} title="Update experience" />
      <FormStateAlert state={deleteState} title="Delete experience" />

      <form id={`update-experience-${experience.id}`} action={updateFormAction} className="grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={experience.id} />
        <div className="space-y-2">
          <Label>Role / Title</Label>
          <Input name="title" defaultValue={experience.title} required />
        </div>
        <div className="space-y-2">
          <Label>Company / Institution</Label>
          <Input name="company" defaultValue={experience.company} required />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <input type="hidden" name="experienceType" value={experienceType} />
          <Combobox value={experienceType} onValueChange={(value) => setExperienceType(value as ExperienceTypeValue)} items={EXPERIENCE_TYPE_OPTIONS}>
            <ComboboxInput className="w-full" placeholder="Choose type" />
            <ComboboxContent>
              <ComboboxEmpty>No type found.</ComboboxEmpty>
              <ComboboxList>
                {EXPERIENCE_TYPE_OPTIONS.map((type) => (
                  <ComboboxItem key={type} value={type}>
                    {EXPERIENCE_TYPE_LABELS[type]}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input name="periodStart" type="date" defaultValue={toDateInputValue(experience.periodStart)} required />
        </div>
        <PresentEndDateField idSuffix={experience.id} defaultPeriodEnd={toDateInputValue(experience.periodEnd)} defaultPresent={!experience.periodEnd} />
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" defaultValue={experience.description} required />
        </div>
        <div className="md:col-span-2 flex flex-row items-center gap-2">
          <FormSubmitButton pendingLabel="Updating..." variant="secondary" className="transition-all hover:-translate-y-0.5 hover:shadow-sm">
            Update
          </FormSubmitButton>
          <DeleteConfirmDialog
            title="Delete experience?"
            description={`Experience \"${experience.title}\" at \"${experience.company}\" akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`}
            action={deleteFormAction}
            itemId={experience.id}
          />
        </div>
      </form>
    </div>
  );
}
