"use client";

import { useActionState } from "react";
import { BrainCircuit, Briefcase, Code2, Database, Globe, Layers3, Monitor, Palette, Plus, Rocket, Shield, Smartphone, Sparkles, Server, Terminal, Trash2, Users, Wrench } from "lucide-react";

import { FormStateAlert } from "@/components/admin/form-state-alert";
import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ABOUT_SKILL_ICON_OPTIONS, ABOUT_SKILL_ICON_DEFAULT, type AboutSkillIconKey } from "@/lib/about-skill-icons";
import type { FormState } from "@/lib/form-state";
import { initialFormState } from "@/lib/form-state";

const SKILL_ICON_COMPONENTS: Record<AboutSkillIconKey, typeof Code2> = {
  code: Code2,
  server: Server,
  palette: Palette,
  users: Users,
  layers: Layers3,
  wrench: Wrench,
  sparkles: Sparkles,
  globe: Globe,
  database: Database,
  monitor: Monitor,
  smartphone: Smartphone,
  terminal: Terminal,
  shield: Shield,
  rocket: Rocket,
  brain: BrainCircuit,
  briefcase: Briefcase,
};

export interface AboutStatFormItem {
  value: string;
  label: string;
}

export interface AboutSkillFormItem {
  title: string;
  icon: AboutSkillIconKey;
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
    onValuesChange({
      ...values,
      stats: values.stats.map((stat, i) => i === index ? { ...stat, [key]: nextValue } : stat),
    });
  };

  const addStat = () => {
    if (values.stats.length >= 6) return;
    onValuesChange({ ...values, stats: [...values.stats, { value: "", label: "" }] });
  };

  const removeStat = (index: number) => {
    onValuesChange({ ...values, stats: values.stats.filter((_, i) => i !== index) });
  };

  const updateSkill = (index: number, key: keyof AboutSkillFormItem, nextValue: string) => {
    onValuesChange({
      ...values,
      skills: values.skills.map((skill, i) => i === index ? { ...skill, [key]: nextValue } : skill),
    });
  };

  const addSkill = () => {
    if (values.skills.length >= 8) return;
    onValuesChange({ ...values, skills: [...values.skills, { title: "", icon: ABOUT_SKILL_ICON_DEFAULT, itemsRaw: "" }] });
  };

  const removeSkill = (index: number) => {
    onValuesChange({ ...values, skills: values.skills.filter((_, i) => i !== index) });
  };

  return (
    <form action={formAction} className="space-y-5">
      <FormStateAlert state={state} title="Save about section" />

      {/* Text content */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" value={values.headline} onChange={(event) => updateField("headline", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paragraph">Paragraph</Label>
          <Textarea id="paragraph" name="paragraph" rows={8} value={values.paragraph} onChange={(event) => updateField("paragraph", event.target.value)} required />
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Stats</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Years Exp. dan Projects otomatis. Custom stat di sini (maks 6).
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addStat} disabled={values.stats.length >= 6} className="gap-1.5 shrink-0">
            <Plus size={14} />
            Add stat
          </Button>
        </div>

        {values.stats.length > 0 && (
          <div className="space-y-2">
            {values.stats.map((stat, index) => (
              <div key={`stat-${index}`} className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={`statValue-${index}`} className="text-xs text-muted-foreground">Value</Label>
                  <Input id={`statValue-${index}`} name="statValue" value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)} placeholder="10+" required />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={`statLabel-${index}`} className="text-xs text-muted-foreground">Label</Label>
                  <Input id={`statLabel-${index}`} name="statLabel" value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)} placeholder="Certificates" required />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeStat(index)}
                  aria-label={`Remove stat ${index + 1}`}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Skill Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Skill Cards</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Item dipisahkan koma. Contoh: React, Next.js, TypeScript
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addSkill} disabled={values.skills.length >= 8} className="gap-1.5 shrink-0">
            <Plus size={14} />
            Add skill card
          </Button>
        </div>

        {values.skills.length > 0 && (
          <div className="space-y-2">
            {values.skills.map((skill, index) => {
              const Icon = SKILL_ICON_COMPONENTS[skill.icon];

              return (
                <div key={`skill-${index}`} className="rounded-md border border-border bg-muted/30 p-3 space-y-2.5">
                  {/* Header row: icon select + title + delete */}
                  <div className="flex items-center gap-2">
                    <Select
                      name="skillIcon"
                      value={skill.icon}
                      onValueChange={(nextValue) => updateSkill(index, "icon", nextValue as AboutSkillIconKey)}
                    >
                      <SelectTrigger className="size-9 shrink-0 px-0 justify-center [&>svg:last-child]:hidden">
                        <Icon size={15} />
                      </SelectTrigger>
                      <SelectContent>
                        {ABOUT_SKILL_ICON_OPTIONS.map(({ value, label }) => {
                          const OptionIcon = SKILL_ICON_COMPONENTS[value];
                          return (
                            <SelectItem key={value} value={value}>
                              <span className="flex items-center gap-2">
                                <OptionIcon size={13} />
                                {label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Input
                      id={`skillTitle-${index}`}
                      name="skillTitle"
                      value={skill.title}
                      onChange={(event) => updateSkill(index, "title", event.target.value)}
                      placeholder="Category (e.g. Frontend)"
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeSkill(index)}
                      aria-label={`Remove skill card ${index + 1}`}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                  {/* Items textarea */}
                  <Textarea
                    id={`skillItems-${index}`}
                    name="skillItemsRaw"
                    value={skill.itemsRaw}
                    onChange={(event) => updateSkill(index, "itemsRaw", event.target.value)}
                    placeholder="React, Next.js, TypeScript"
                    rows={2}
                    className="resize-none text-sm"
                    required
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      <FormSubmitButton pendingLabel="Saving about..." className="w-full sm:w-fit">Save About Section</FormSubmitButton>
    </form>
  );
}
