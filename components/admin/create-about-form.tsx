"use client";

import { useActionState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

export interface AboutStatFormItem {
  value: string;
  label: string;
}

export interface AboutSkillFormItem {
  title: string;
  itemsRaw: string;
}

export interface AboutSectionFormValues {
  headline: string;
  paragraph: string;
  stats: AboutStatFormItem[];
  skills: AboutSkillFormItem[];
}

interface CreateAboutFormProps {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  values: AboutSectionFormValues;
  onValuesChange: (values: AboutSectionFormValues) => void;
}

export function CreateAboutForm({ action, values, onValuesChange }: CreateAboutFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  const updateField = <Key extends keyof AboutSectionFormValues>(key: Key, nextValue: AboutSectionFormValues[Key]) => {
    onValuesChange({ ...values, [key]: nextValue });
  };

  const updateStat = (index: number, key: keyof AboutStatFormItem, nextValue: string) => {
    const nextStats = values.stats.map((stat, statIndex) => {
      if (statIndex !== index) {
        return stat;
      }

      return { ...stat, [key]: nextValue };
    });

    onValuesChange({ ...values, stats: nextStats });
  };

  const addStat = () => {
    if (values.stats.length >= 6) {
      return;
    }

    onValuesChange({
      ...values,
      stats: [...values.stats, { value: "", label: "" }],
    });
  };

  const removeStat = (index: number) => {
    onValuesChange({
      ...values,
      stats: values.stats.filter((_, statIndex) => statIndex !== index),
    });
  };

  const updateSkill = (index: number, key: keyof AboutSkillFormItem, nextValue: string) => {
    const nextSkills = values.skills.map((skill, skillIndex) => {
      if (skillIndex !== index) {
        return skill;
      }

      return { ...skill, [key]: nextValue };
    });

    onValuesChange({ ...values, skills: nextSkills });
  };

  const addSkill = () => {
    if (values.skills.length >= 8) {
      return;
    }

    onValuesChange({
      ...values,
      skills: [...values.skills, { title: "", itemsRaw: "" }],
    });
  };

  const removeSkill = (index: number) => {
    onValuesChange({
      ...values,
      skills: values.skills.filter((_, skillIndex) => skillIndex !== index),
    });
  };

  return (
    <form action={formAction} className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormStateAlert state={state} title="Save about section" />
      </div>

      <div className="md:col-span-2 grid gap-4 rounded-lg border border-border p-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" value={values.headline} onChange={(event) => updateField("headline", event.target.value)} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="paragraph">Paragraph</Label>
          <Textarea id="paragraph" name="paragraph" rows={8} value={values.paragraph} onChange={(event) => updateField("paragraph", event.target.value)} required />
        </div>
      </div>

      <div className="md:col-span-2 rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Stats</p>
          <Button type="button" variant="outline" size="sm" onClick={addStat} disabled={values.stats.length >= 6} className="gap-2">
            <Plus size={16} />
            Add stat
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Years Exp. dan Projects dihitung otomatis dari data, jadi tidak ditampilkan di form manager.</p>
        <p className="text-xs text-muted-foreground">Isi angka/range manual untuk stat custom. Contoh: 10+</p>
        <div className="space-y-3">
          {values.stats.map((stat, index) => {
            return (
              <div key={`stat-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-start">
                <div className="space-y-2">
                  <Label htmlFor={`statValue-${index}`}>Stat Value</Label>
                  <Input id={`statValue-${index}`} name="statValue" value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)} required />
                  <p className="text-xs text-muted-foreground">Isi angka/range manual. Contoh: 10+</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`statLabel-${index}`}>Stat Label</Label>
                  <Input id={`statLabel-${index}`} name="statLabel" value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)} required />
                  <p className="text-xs opacity-0 pointer-events-none select-none" aria-hidden="true">
                    spacer
                  </p>
                </div>
                <div className="space-y-2 shrink-0">
                  <Label className="opacity-0 pointer-events-none select-none" aria-hidden="true">
                    Delete
                  </Label>
                  <Button type="button" variant="destructive" size="icon" className="shrink-0" onClick={() => removeStat(index)} aria-label={`Remove stat ${index + 1}`}>
                    <Trash2 size={16} />
                  </Button>
                  <p className="text-xs opacity-0 pointer-events-none select-none" aria-hidden="true">
                    spacer
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2 rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Skill Cards</p>
          <Button type="button" variant="outline" size="sm" onClick={addSkill} disabled={values.skills.length >= 8} className="gap-2">
            <Plus size={16} />
            Add skill card
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Isi item skill dipisahkan koma. Contoh: React, Next.js, TypeScript</p>
        <div className="space-y-3">
          {values.skills.map((skill, index) => (
            <div key={`skill-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-start">
              <div className="space-y-2">
                <Label htmlFor={`skillTitle-${index}`}>Skill Card Title</Label>
                <Input id={`skillTitle-${index}`} name="skillTitle" value={skill.title} onChange={(event) => updateSkill(index, "title", event.target.value)} required />
                <p className="text-xs text-muted-foreground">Contoh: Frontend, Backend, Design</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`skillItems-${index}`}>Skill Card Items</Label>
                <Input id={`skillItems-${index}`} name="skillItemsRaw" value={skill.itemsRaw} onChange={(event) => updateSkill(index, "itemsRaw", event.target.value)} placeholder="React, Next.js, TypeScript" required />
                <p className="text-xs opacity-0 pointer-events-none select-none" aria-hidden="true">
                  spacer
                </p>
              </div>
              <div className="space-y-2 shrink-0">
                <Label className="opacity-0 pointer-events-none select-none" aria-hidden="true">
                  Delete
                </Label>
                <Button type="button" variant="destructive" size="icon" className="shrink-0" onClick={() => removeSkill(index)} aria-label={`Remove skill card ${index + 1}`}>
                  <Trash2 size={16} />
                </Button>
                <p className="text-xs opacity-0 pointer-events-none select-none" aria-hidden="true">
                  spacer
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <FormSubmitButton pendingLabel="Saving about...">Save About Section</FormSubmitButton>
      </div>
    </form>
  );
}
