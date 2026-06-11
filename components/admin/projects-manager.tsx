"use client";

import { useState } from "react";
import { Eye, Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CreateProjectForm } from "@/components/admin/create-project-form";
import { ProjectEditItem } from "@/components/admin/project-edit-item";
import type { FormState } from "@/lib/form-state";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  githubUrl: string | null;
  techStack: string[];
  isPublished: boolean;
  createdAt?: string;
}

interface ProjectView {
  total_views: number;
  unique_viewers: number;
}

interface ProjectsManagerProps {
  projects: Project[];
  viewsMap?: Record<string, ProjectView>;
  createAction: (state: FormState, formData: FormData) => Promise<FormState>;
  updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function ProjectsManager({ projects, viewsMap = {}, createAction, updateAction, deleteAction }: ProjectsManagerProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const editing = editingId ? projects.find((p) => p.id === editingId) : null;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setIsCreating(true)}>
            <Plus size={14} />
            New Project
          </Button>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No projects found
            </p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setEditingId(p.id)}
                className="w-full rounded-lg border border-border p-4 text-left space-y-2 hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{p.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {viewsMap[p.id] && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye size={11} />
                        {viewsMap[p.id].total_views.toLocaleString()}
                      </span>
                    )}
                    <Badge variant={p.isPublished ? "default" : "outline"} className="text-xs">
                      {p.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.techStack.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                  {p.techStack.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{p.techStack.length - 3}</Badge>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tech Stack</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setEditingId(p.id)}
                    >
                      <td className="px-4 py-3 font-medium text-sm">{p.title}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.techStack.slice(0, 3).map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                          ))}
                          {p.techStack.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{p.techStack.length - 3}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={p.isPublished ? "default" : "outline"} className="text-xs">
                          {p.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {viewsMap[p.id] ? (
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Eye size={13} />
                            {viewsMap[p.id].total_views.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); setEditingId(p.id); }}
                          aria-label={`Edit ${p.title}`}
                        >
                          <Pencil size={13} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {projects.length} projects
        </p>
      </div>

      {/* Create Sheet */}
      <Sheet open={isCreating} onOpenChange={setIsCreating}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-base">New Project</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <CreateProjectForm action={createAction} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(open) => !open && setEditingId(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-base truncate">{editing?.title}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {editing && (
              <ProjectEditItem
                project={editing}
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
