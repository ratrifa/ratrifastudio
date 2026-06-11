"use client";

/**
 * Project Detail Techstack Component
 * Display technology stack sebagai chips
 */

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
    <div className="space-y-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Tech Stack
      </h2>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
