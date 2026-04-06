"use client";

import { useActionState } from "react";

import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { FileDropInput } from "@/components/admin/file-drop-input";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSwitchField } from "@/components/admin/form-switch-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface CertificateEditItemProps {
  certificate: {
    id: string;
    title: string;
    issuer: string;
    issueDate: Date | string;
    imageUrl: string | null;
    credentialUrl: string | null;
    featured: boolean;
  };
  updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

function toDateInputValue(value: Date | string) {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

export function CertificateEditItem({ certificate, updateAction, deleteAction }: CertificateEditItemProps) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialFormState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialFormState);

  return (
    <div className="space-y-3">
      <FormStateAlert state={updateState} title="Update certificate" />
      <FormStateAlert state={deleteState} title="Delete certificate" />

      <form id={`update-certificate-${certificate.id}`} action={updateFormAction} className="grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={certificate.id} />
        <div className="space-y-2">
          <Label>Title</Label>
          <Input name="title" defaultValue={certificate.title} required />
        </div>
        <div className="space-y-2">
          <Label>Issuer</Label>
          <Input name="issuer" defaultValue={certificate.issuer} required />
        </div>
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <Input name="issueDate" type="date" defaultValue={toDateInputValue(certificate.issueDate)} required />
        </div>
        <FileDropInput name="imageFile" label="Replace Image (optional)" accept="image/png,image/jpeg,image/webp" helperText="PNG/JPG/WEBP, max 2MB" />
        <div className="space-y-2 md:col-span-2">
          <Label>Credential URL</Label>
          <Input name="credentialUrl" defaultValue={certificate.credentialUrl ?? ""} />
        </div>
        <FormSwitchField id={`featured-${certificate.id}`} name="featured" label="Featured" defaultChecked={certificate.featured} className="md:col-span-2" />
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button form={`update-certificate-${certificate.id}`} type="submit" variant="secondary" className="w-full sm:w-fit transition-all hover:-translate-y-0.5 hover:shadow-sm">
          Update
        </Button>
        <DeleteConfirmDialog title="Delete certificate?" description={`Certificate \"${certificate.title}\" akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`} action={deleteFormAction} itemId={certificate.id} />
      </div>
    </div>
  );
}
