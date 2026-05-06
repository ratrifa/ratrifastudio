"use client";

/**
 * Project Detail Links Component
 * Display Demo & Repository buttons with icons
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="gap-2">
            <ExternalLink className="h-5 w-5" />
            Live Demo
          </Button>
        </Link>
      )}

      {/* GitHub Repository Button */}
      {githubUrl && (
        <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Github className="h-5 w-5" />
            View Repository
            {isPrivateRepo && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Private
              </Badge>
            )}
          </Button>
        </Link>
      )}
    </div>
  );
}
