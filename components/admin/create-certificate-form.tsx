"use client";

import { useActionState } from "react";

import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { FormSwitchField } from "@/components/admin/form-switch-field";
import { FileDropInput } from "@/components/admin/file-drop-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface CreateCertificateFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function CreateCertificateForm({ action }: CreateCertificateFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormStateAlert state={state} title="Create certificate" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issuer">Issuer</Label>
        <Input id="issuer" name="issuer" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issueDate">Issue Date</Label>
        <Input id="issueDate" name="issueDate" type="date" required />
      </div>
      <FileDropInput id="imageFile" name="imageFile" label="Image Upload" accept="image/png,image/jpeg,image/webp" helperText="PNG/JPG/WEBP, max 2MB" />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="credentialUrl">Credential URL</Label>
        <Input id="credentialUrl" name="credentialUrl" placeholder="https://..." />
      </div>
      <FormSwitchField name="featured" label="Featured" className="md:col-span-2" />
      <FormSubmitButton pendingLabel="Creating..." className="w-full sm:w-fit md:col-span-2">
        Create
      </FormSubmitButton>
    </form>
  );
}
