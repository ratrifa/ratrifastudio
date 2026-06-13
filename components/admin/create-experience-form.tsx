"use client";

import { useActionState, useState } from "react";

import { PresentEndDateField } from "@/components/admin/present-end-date-field";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { MultiFileDropInput } from "@/components/admin/multi-file-drop-input";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { EXPERIENCE_TYPE_LABELS, EXPERIENCE_TYPE_OPTIONS, type ExperienceTypeValue } from "@/lib/experience-types";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";
import { useFormToast } from "@/lib/use-form-toast";

interface CreateExperienceFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function CreateExperienceForm({ action }: CreateExperienceFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  useFormToast(state);
  const [experienceType, setExperienceType] = useState<ExperienceTypeValue>("full-time");

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
        <Label>Kategori</Label>
        <RadioGroup name="category" defaultValue="education" className="flex flex-row gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="work" id="create-cat-work" />
            <Label htmlFor="create-cat-work" className="font-normal cursor-pointer">Kerja</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="education" id="create-cat-education" />
            <Label htmlFor="create-cat-education" className="font-normal cursor-pointer">Kuliah</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experienceType">Type</Label>
        <input type="hidden" name="experienceType" value={experienceType} />
        <Combobox value={experienceType} onValueChange={(value) => setExperienceType(value as ExperienceTypeValue)} items={EXPERIENCE_TYPE_OPTIONS}>
          <ComboboxInput id="experienceType" className="w-full" placeholder="Choose type" />
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
        <Label htmlFor="periodStart">Start Date</Label>
        <Input id="periodStart" name="periodStart" type="date" required />
      </div>
      <PresentEndDateField idSuffix="create" />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <MultiFileDropInput name="imageFiles" label="Dokumentasi Foto (Opsional)" accept="image/png,image/jpeg,image/webp" helperText="PNG/JPG/WEBP, max 2MB per file, max 15 files" maxFiles={15} maxBytes={2 * 1024 * 1024} className="md:col-span-2" />
      <FormSubmitButton pendingLabel="Creating..." className="w-full sm:w-fit md:col-span-2">
        Create
      </FormSubmitButton>
    </form>
  );
}
