"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProjectViewerProps {
  projects: any[];
}

export function ProjectViewer({ projects }: ProjectViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = projects.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-sm" />
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No projects found</div>
        ) : (
          filtered.map((project) => (
            <div key={project.id} className="rounded-lg border border-border p-4 space-y-2">
              <p className="font-medium text-sm">{project.title}</p>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(project.techStack) &&
                  project.techStack.slice(0, 3).map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant={project.isPublished ? "default" : "outline"}>{project.isPublished ? "Published" : "Draft"}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(project.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tech Stack</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Published</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No projects found
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-sm">{project.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(project.techStack) &&
                          project.techStack.slice(0, 3).map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        {Array.isArray(project.techStack) && project.techStack.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.techStack.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={project.isPublished ? "default" : "outline"}>{project.isPublished ? "Published" : "Draft"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {projects.length} projects
      </div>
    </div>
  );
}
