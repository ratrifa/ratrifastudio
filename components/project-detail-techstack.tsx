"use client";

/**
 * Project Detail Techstack Component
 * Display technology stack sebagai badges
 */

import { Badge } from "@/components/ui/badge";

interface ProjectDetailTechstackProps {
  techStack: string[];
}

export function ProjectDetailTechstack({
  techStack,
}: ProjectDetailTechstackProps) {
  if (!techStack || techStack.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Tech Stack</h2>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="outline" className="text-sm">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}
