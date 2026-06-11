"use client";

import { useActionState, useEffect, useState } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Trash2 } from "lucide-react";

import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { PresentEndDateField } from "@/components/admin/present-end-date-field";
import { MultiFileDropInput } from "@/components/admin/multi-file-drop-input";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_TYPE_LABELS, EXPERIENCE_TYPE_OPTIONS, normalizeExperienceType, type ExperienceTypeValue } from "@/lib/experience-types";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";
import { useFormToast } from "@/lib/use-form-toast";
import { apiUrl } from "@/lib/api";

interface ExperiencePhotoType {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface ExperienceEditItemProps {
  experience: {
    id: string;
    title: string;
    company: string;
    experienceType?: ExperienceTypeValue | string | null;
    periodStart: Date | string;
    periodEnd: Date | string | null;
    description: string;
    photos?: ExperiencePhotoType[];
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

async function deleteExperiencePhoto(photoId: string) {
  try {
    const res = await fetch(apiUrl(`/api/experiences/photos/${photoId}`), {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Gagal hapus foto");
    return true;
  } catch {
    return false;
  }
}

export function ExperienceEditItem({ experience, updateAction, deleteAction }: ExperienceEditItemProps) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialFormState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialFormState);
  useFormToast(updateState);
  useFormToast(deleteState);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [photos, setPhotos] = useState(experience.photos ?? []);
  const [uploadResetSignal, setUploadResetSignal] = useState(0);
  const defaultExperienceType = normalizeExperienceType(experience.experienceType) ?? "full-time";
  const [experienceType, setExperienceType] = useState<ExperienceTypeValue>(defaultExperienceType);

  useEffect(() => {
    if (updateState.status === "success") {
      setUploadResetSignal((prev) => prev + 1);
    }
  }, [updateState.status]);

  const handleDeletePhoto = async (photoId: string) => {
    setDeletingPhotoId(photoId);
    const success = await deleteExperiencePhoto(photoId);
    if (success) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
    setDeletingPhotoId(null);
  };

  return (
    <div className="space-y-3">
      <FormStateAlert state={updateState} title="Update experience" />
      <FormStateAlert state={deleteState} title="Delete experience" />

      {/* Existing Photos Gallery */}
      {photos.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border bg-card/30 p-3">
          <p className="text-sm font-medium">Dokumentasi Foto ({photos.length})</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <ImageWithFallback src={photo.imageUrl} alt="Dokumentasi" fill className="object-cover transition-opacity group-hover:opacity-70" />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  disabled={deletingPhotoId === photo.id}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                  title="Delete photo"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <MultiFileDropInput
          name="imageFiles"
          label="Tambah Dokumentasi Foto (Opsional)"
          accept="image/png,image/jpeg,image/webp"
          helperText="PNG/JPG/WEBP, max 2MB per file, max 10 files"
          maxFiles={10}
          resetSignal={uploadResetSignal}
          className="md:col-span-2"
        />
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
