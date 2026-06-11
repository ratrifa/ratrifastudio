"use client";

/**
 * Project Detail Links Component
 * Display Demo & Repository buttons with icons
 */

import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

interface ProjectDetailLinksProps {
  demoUrl: string;
  githubUrl: string;
  isPrivateRepo?: boolean;
}

export function ProjectDetailLinks({
  demoUrl,
  githubUrl,
  isPrivateRepo = false,
}: ProjectDetailLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Live Demo Button */}
      {demoUrl && (
        <Link
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:opacity-90"
        >
          <ExternalLink className="size-4" />
          Live Demo
        </Link>
      )}

      {/* GitHub Repository Button */}
      {githubUrl && (
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-6 text-sm font-medium text-foreground transition-all hover:gap-3 hover:bg-secondary"
        >
          <Github className="size-4" />
          View Repository
          {isPrivateRepo && (
            <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Private
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
