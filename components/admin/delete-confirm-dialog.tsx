"use client";

import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  triggerLabel?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  action: (formData: FormData) => void | Promise<void>;
  itemId: string;
}

export function DeleteConfirmDialog({ triggerLabel = "Delete", title, description, confirmLabel = "Delete", cancelLabel = "Cancel", action, itemId }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-full sm:w-auto transition-all hover:-translate-y-0.5 hover:shadow-sm">
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <form action={action}>
            <input type="hidden" name="id" value={itemId} />
            <AlertDialogAction asChild>
              <FormSubmitButton pendingLabel="Deleting..." variant="destructive">
                {confirmLabel}
              </FormSubmitButton>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
