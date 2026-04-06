import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Backlight } from "@/components/ui/backlight";
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
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.title}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              <Github size={13} />
              Code
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="font-semibold text-foreground text-base leading-snug text-balance">{project.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">{project.description}</p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs font-mono bg-secondary text-secondary-foreground border border-border">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
