"use client";

import { useActionState } from "react";

import { PresentEndDateField } from "@/components/admin/present-end-date-field";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface CreateExperienceFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function CreateExperienceForm({ action }: CreateExperienceFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormStateAlert state={state} title="Create experience" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Role / Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company / Institution</Label>
        <Input id="company" name="company" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="periodStart">Start Date</Label>
        <Input id="periodStart" name="periodStart" type="date" required />
      </div>
      <PresentEndDateField idSuffix="create" />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <FormSubmitButton pendingLabel="Creating..." className="w-full sm:w-fit md:col-span-2">
        Create
      </FormSubmitButton>
    </form>
  );
}
