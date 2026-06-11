"use client";

import { useState } from "react";
import { Image as ImageIcon, Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CreateExperienceForm } from "@/components/admin/create-experience-form";
import { ExperienceEditItem } from "@/components/admin/experience-edit-item";
import { EXPERIENCE_TYPE_LABELS, normalizeExperienceType } from "@/lib/experience-types";
import type { ExperienceTypeValue } from "@/lib/experience-types";
import type { FormState } from "@/lib/form-state";

interface ExperiencePhoto {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  experienceType: ExperienceTypeValue | string | null;
  periodStart: string;
  periodEnd: string | null;
  description: string;
  photos: ExperiencePhoto[];
}

interface ExperiencesManagerProps {
  experiences: Experience[];
  createAction: (state: FormState, formData: FormData) => Promise<FormState>;
  updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function ExperiencesManager({ experiences, createAction, updateAction, deleteAction }: ExperiencesManagerProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = experiences.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase()),
  );

  const editing = editingId ? experiences.find((e) => e.id === editingId) : null;

  const formatPeriod = (e: Experience) => {
    const start = new Date(e.periodStart).toLocaleDateString("id-ID", { year: "numeric", month: "short" });
    const end = e.periodEnd
      ? new Date(e.periodEnd).toLocaleDateString("id-ID", { year: "numeric", month: "short" })
      : "Present";
    return `${start} – ${end}`;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search experiences..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setIsCreating(true)}>
            <Plus size={14} />
            New Experience
          </Button>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No experiences found
            </p>
          ) : (
            filtered.map((exp) => {
              const expType = normalizeExperienceType(exp.experienceType);
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setEditingId(exp.id)}
                  className="w-full rounded-lg border border-border p-4 text-left space-y-2 hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{exp.title}</p>
                    <Badge variant={!exp.periodEnd ? "default" : "outline"} className="shrink-0 text-xs">
                      {!exp.periodEnd ? "Ongoing" : "Completed"}
                    </Badge>
                  </div>
                  {expType && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/30">
                      {EXPERIENCE_TYPE_LABELS[expType]}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">{formatPeriod(exp)}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Period</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Photos</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No experiences found
                    </td>
                  </tr>
                ) : (
                  filtered.map((exp) => {
                    const expType = normalizeExperienceType(exp.experienceType);
                    const photoCount = exp.photos?.length ?? 0;
                    return (
                      <tr
                        key={exp.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setEditingId(exp.id)}
                      >
                        <td className="px-4 py-3 font-medium text-sm">{exp.title}</td>
                        <td className="px-4 py-3 text-sm">{exp.company}</td>
                        <td className="px-4 py-3">
                          {expType ? (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/30">
                              {EXPERIENCE_TYPE_LABELS[expType]}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{formatPeriod(exp)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={!exp.periodEnd ? "default" : "outline"} className="text-xs">
                            {!exp.periodEnd ? "Ongoing" : "Completed"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {photoCount > 0 ? (
                            <div className="flex items-center gap-1">
                              <ImageIcon size={13} />
                              {photoCount}
                            </div>
                          ) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); setEditingId(exp.id); }}
                            aria-label={`Edit ${exp.title}`}
                          >
                            <Pencil size={13} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {experiences.length} experiences
        </p>
      </div>

      {/* Create Sheet */}
      <Sheet open={isCreating} onOpenChange={setIsCreating}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-base">New Experience</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <CreateExperienceForm action={createAction} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(open) => !open && setEditingId(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-base truncate">{editing?.title}</SheetTitle>
            {editing && (
              <p className="text-sm text-muted-foreground">{editing.company}</p>
            )}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {editing && (
              <ExperienceEditItem
                experience={editing}
                updateAction={updateAction}
                deleteAction={deleteAction}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
