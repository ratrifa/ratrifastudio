"use client";

import { useActionState } from "react";

import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSwitchField } from "@/components/admin/form-switch-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface ProjectEditItemProps {
  project: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    link: string | null;
    githubUrl: string | null;
    techStack: unknown;
    isPublished: boolean;
  };
  updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function ProjectEditItem({ project, updateAction, deleteAction }: ProjectEditItemProps) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialFormState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialFormState);

  return (
    <div className="space-y-3">
      <FormStateAlert state={updateState} title="Update project" />
      <FormStateAlert state={deleteState} title="Delete project" />

      <form id={`update-project-${project.id}`} action={updateFormAction} className="grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={project.id} />
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input name="title" defaultValue={project.title} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" defaultValue={project.description} required />
        </div>
        <div className="space-y-2">
          <Label>Replace Image (optional)</Label>
          <Input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" />
        </div>
        <div className="space-y-2">
          <Label>Demo Link</Label>
          <Input name="link" defaultValue={project.link ?? ""} />
        </div>
        <div className="space-y-2">
          <Label>GitHub Link</Label>
          <Input name="githubUrl" defaultValue={project.githubUrl ?? ""} />
        </div>
        <div className="space-y-2">
          <Label>Tech Stack</Label>
          <Input name="techStackRaw" defaultValue={Array.isArray(project.techStack) ? project.techStack.join(", ") : ""} required />
        </div>
        <FormSwitchField id={`isPublished-${project.id}`} name="isPublished" label="Published" defaultChecked={project.isPublished} className="md:col-span-2" />
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button form={`update-project-${project.id}`} type="submit" variant="secondary" className="w-full sm:w-fit transition-all hover:-translate-y-0.5 hover:shadow-sm">
          Update
        </Button>
        <DeleteConfirmDialog title="Delete project?" description={`Project \"${project.title}\" akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`} action={deleteFormAction} itemId={project.id} />
      </div>
    </div>
  );
}
