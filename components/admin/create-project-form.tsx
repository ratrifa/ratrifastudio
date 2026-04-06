"use client";

import { useActionState } from "react";

import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { FormSwitchField } from "@/components/admin/form-switch-field";
import { FileDropInput } from "@/components/admin/file-drop-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface CreateProjectFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function CreateProjectForm({ action }: CreateProjectFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormStateAlert state={state} title="Create project" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <FileDropInput id="imageFile" name="imageFile" label="Image Upload" accept="image/png,image/jpeg,image/webp" helperText="PNG/JPG/WEBP, max 2MB" />
      <div className="space-y-2">
        <Label htmlFor="link">Demo Link</Label>
        <Input id="link" name="link" placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub Link</Label>
        <Input id="githubUrl" name="githubUrl" placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="techStackRaw">Tech Stack (comma separated)</Label>
        <Input id="techStackRaw" name="techStackRaw" placeholder="Next.js, TypeScript, MySQL" required />
      </div>
      <FormSwitchField name="isPublished" label="Published" defaultChecked className="md:col-span-2" />
      <FormSubmitButton pendingLabel="Creating..." className="md:col-span-2 w-full sm:w-fit">
        Create
      </FormSubmitButton>
    </form>
  );
}
