import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Backlight } from "@/components/ui/backlight";
import { Tilt, TiltContent } from "./animate-ui/primitives/effects/tilt";
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech_stack: string[];
  demo_url?: string;
  repo_url?: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group bg-card border-border hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Actions removed from image overlay to avoid darkening image. */}
      </div>

      {/* Content */}
      <CardContent className="flex flex-col gap-3 p-5 pt-0 scroll-pt-40 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/projects/${project.id}`}
            aria-label={`View details of ${project.title}`}
            className="flex items-center gap-1.5 pr-3 py-1.5 rounded-md text-secondary-foreground text-sm sm:text-xs font-medium hover:text-primary transition-colors"
          >
            <Eye size={13} />
            View Detail
          </Link>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.title}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-secondary-foreground text-sm sm:text-xs font-medium hover:text-primary transition-colors"
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source code of ${project.title}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-secondary-foreground text-sm sm:text-xs font-medium hover:text-primary transition-colors"
            >
              <Github size={13} />
              Code
            </a>
          )}
        </div>

        <h3 className="font-semibold text-foreground text-base leading-snug text-balance">{project.title}</h3>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 flex-1">{project.description}</p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs sm:text-sm font-mono bg-secondary text-secondary-foreground border border-border">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
