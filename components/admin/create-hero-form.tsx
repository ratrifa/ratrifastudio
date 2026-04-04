"use client";

import { useActionState } from "react";

import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <form action={formAction} className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormStateAlert state={state} title="Save hero section" />
      </div>

      <div className="md:col-span-2 rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Availability</p>
            <p className="text-sm text-muted-foreground">Toggle status open to work di hero frontend.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{safeValues.openToWork ? "Open" : "Closed"}</span>
            <Switch checked={safeValues.openToWork} onCheckedChange={(checked) => updateField("openToWork", checked)} />
          </div>
        </div>
        <input type="hidden" name="openToWork" value={safeValues.openToWork ? "true" : "false"} />
        <input type="hidden" name="statusBadgeDetail" value={safeValues.statusBadgeDetail} />
      </div>

      <div className="md:col-span-2 grid gap-4 md:grid-cols-2 rounded-lg border border-border p-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" value={safeValues.headline} onChange={(event) => updateField("headline", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={safeValues.name} onChange={(event) => updateField("name", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" value={safeValues.role} onChange={(event) => updateField("role", event.target.value)} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={safeValues.description} onChange={(event) => updateField("description", event.target.value)} rows={5} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domainLabel">Domain label</Label>
          <Input id="domainLabel" name="domainLabel" value={safeValues.domainLabel} onChange={(event) => updateField("domainLabel", event.target.value)} placeholder="yourname.dev" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domainLogoFile">Logo domain upload</Label>
          <Input id="domainLogoFile" name="domainLogoFile" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" />
        </div>
      </div>

      <div className="md:col-span-2 grid gap-4 md:grid-cols-2 rounded-lg border border-border p-4">
        <div className="space-y-2">
          <Label htmlFor="avatarFile">Profile photo upload</Label>
          <Input id="avatarFile" name="avatarFile" type="file" accept="image/png,image/jpeg,image/webp" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="avatarAlt">Profile photo alt text</Label>
          <Input id="avatarAlt" name="avatarAlt" value={safeValues.avatarAlt} onChange={(event) => updateField("avatarAlt", event.target.value)} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cvFile">Upload CV file (optional)</Label>
          <Input id="cvFile" name="cvFile" type="file" accept="application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx" />
        </div>
      </div>

      <div className="md:col-span-2 grid gap-4 md:grid-cols-2 rounded-lg border border-border p-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="techTagsRaw">Tech tags</Label>
          <Input id="techTagsRaw" name="techTagsRaw" value={safeValues.techTagsRaw} onChange={(event) => updateField("techTagsRaw", event.target.value)} placeholder="React, Next.js, TypeScript" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" name="githubUrl" value={safeValues.githubUrl} onChange={(event) => updateField("githubUrl", event.target.value)} placeholder="https://github.com/..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" name="linkedinUrl" value={safeValues.linkedinUrl} onChange={(event) => updateField("linkedinUrl", event.target.value)} placeholder="https://linkedin.com/..." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="twitterUrl">Twitter / X URL</Label>
          <Input id="twitterUrl" name="twitterUrl" value={safeValues.twitterUrl} onChange={(event) => updateField("twitterUrl", event.target.value)} placeholder="https://x.com/..." />
        </div>
      </div>

      <div className="md:col-span-2">
        <FormSubmitButton pendingLabel="Saving hero..." className="w-full sm:w-fit">
          Save Hero Section
        </FormSubmitButton>
      </div>
    </form>
  );
}
