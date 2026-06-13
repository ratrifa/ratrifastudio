"use client";

import { useActionState } from "react";

import { FileDropInput } from "@/components/admin/file-drop-input";
import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { HeroSectionContent } from "@/lib/hero-content";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

interface HeroSectionFormValues extends HeroSectionContent {
  techTagsRaw: string;
}

interface CreateHeroFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  values: HeroSectionFormValues;
  onValuesChange: (values: HeroSectionFormValues) => void;
}

export function CreateHeroForm({ action, values, onValuesChange }: CreateHeroFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  const safeValues = {
    headline: values.headline ?? "",
    description: values.description ?? "",
    name: values.name ?? "",
    role: values.role ?? "",
    domainLabel: values.domainLabel ?? "",
    techTagsRaw: values.techTagsRaw ?? "",
    avatarAlt: values.avatarAlt ?? "",
    githubUrl: values.githubUrl ?? "",
    linkedinUrl: values.linkedinUrl ?? "",
    twitterUrl: values.twitterUrl ?? "",
    statusBadgeDetail: values.statusBadgeDetail ?? "",
    openToWork: Boolean(values.openToWork),
  };

  const updateField = <Key extends keyof HeroSectionFormValues>(key: Key, nextValue: HeroSectionFormValues[Key]) => {
    onValuesChange({ ...values, [key]: nextValue });
  };

  return (
    <form action={formAction} className="space-y-5">
      <FormStateAlert state={state} title="Save hero section" />

      {/* Availability */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Open to work</p>
          <p className="text-xs text-muted-foreground mt-0.5">Ditampilkan sebagai status availability di hero.</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs text-muted-foreground">{safeValues.openToWork ? "Open" : "Closed"}</span>
          <Switch checked={safeValues.openToWork} onCheckedChange={(checked) => updateField("openToWork", checked)} />
        </div>
      </div>
      <input type="hidden" name="openToWork" value={safeValues.openToWork ? "true" : "false"} />
      <input type="hidden" name="statusBadgeDetail" value={safeValues.statusBadgeDetail} />

      <Separator />

      {/* Identity */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" value={safeValues.headline} onChange={(e) => updateField("headline", e.target.value)} required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={safeValues.name} onChange={(e) => updateField("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" value={safeValues.role} onChange={(e) => updateField("role", e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={safeValues.description} onChange={(e) => updateField("description", e.target.value)} rows={4} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domainLabel">Domain</Label>
          <Input id="domainLabel" name="domainLabel" value={safeValues.domainLabel} onChange={(e) => updateField("domainLabel", e.target.value)} placeholder="yourname.dev" required />
        </div>
        <div className="flex justify-center">
          <FileDropInput
            id="domainLogoFile"
            name="domainLogoFile"
            label="Logo domain"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            helperText="PNG/JPG/WEBP/SVG, max 2MB"
            maxBytes={2 * 1024 * 1024}
            currentImageUrl={values.domainLogoUrl ?? undefined}
            aspectRatio="1/1"
            className="w-32"
          />
        </div>
      </div>

      <Separator />

      {/* Media */}
      <div className="space-y-3">
        <div className="flex justify-center">
          <FileDropInput
            id="avatarFile"
            name="avatarFile"
            label="Foto profil"
            accept="image/png,image/jpeg,image/webp"
            helperText="PNG/JPG/WEBP, max 2MB"
            maxBytes={2 * 1024 * 1024}
            currentImageUrl={values.avatarUrl ?? undefined}
            aspectRatio="4/5"
            className="w-40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarAlt">Alt text foto profil</Label>
          <Input id="avatarAlt" name="avatarAlt" value={safeValues.avatarAlt} onChange={(e) => updateField("avatarAlt", e.target.value)} required />
        </div>
        <FileDropInput
          id="cvFile"
          name="cvFile"
          label="CV (opsional)"
          accept="application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
          helperText="PDF, DOC, DOCX (max 5MB)"
          maxBytes={5 * 1024 * 1024}
        />
      </div>

      <Separator />

      {/* Links & Tech */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="techTagsRaw">Tech tags</Label>
          <Input id="techTagsRaw" name="techTagsRaw" value={safeValues.techTagsRaw} onChange={(e) => updateField("techTagsRaw", e.target.value)} placeholder="React, Next.js, TypeScript" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub</Label>
            <Input id="githubUrl" name="githubUrl" value={safeValues.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn</Label>
            <Input id="linkedinUrl" name="linkedinUrl" value={safeValues.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitterUrl">Twitter / X</Label>
            <Input id="twitterUrl" name="twitterUrl" value={safeValues.twitterUrl} onChange={(e) => updateField("twitterUrl", e.target.value)} placeholder="https://x.com/..." />
          </div>
        </div>
      </div>

      <FormSubmitButton pendingLabel="Saving hero..." className="w-full sm:w-fit">
        Save Hero Section
      </FormSubmitButton>
    </form>
  );
}
