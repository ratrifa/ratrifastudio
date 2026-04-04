"use client";

import { useActionState } from "react";

import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { PresentEndDateField } from "@/components/admin/present-end-date-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface ExperienceEditItemProps {
  experience: {
    id: string;
    title: string;
    company: string;
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
          <Label>Start Date</Label>
          <Input name="periodStart" type="date" defaultValue={toDateInputValue(experience.periodStart)} required />
        </div>
        <PresentEndDateField idSuffix={experience.id} defaultPeriodEnd={toDateInputValue(experience.periodEnd)} defaultPresent={!experience.periodEnd} />
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" defaultValue={experience.description} required />
        </div>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button form={`update-experience-${experience.id}`} type="submit" variant="secondary" className="w-full sm:w-fit transition-all hover:-translate-y-0.5 hover:shadow-sm">
          Update
        </Button>
        <DeleteConfirmDialog
          title="Delete experience?"
          description={`Experience \"${experience.title}\" at \"${experience.company}\" akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`}
          action={deleteFormAction}
          itemId={experience.id}
        />
      </div>
    </div>
  );
}
