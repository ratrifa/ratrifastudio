import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ExternalLink, Github, Eye } from "lucide-react";

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
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <article className="group flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-md border border-border">
        <ImageWithFallback src={project.image} alt={project.title} fill className="object-cover grayscale-[55%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]" />
        <span className="absolute top-3 left-3 font-mono text-xs text-background bg-foreground/70 backdrop-blur-sm rounded px-1.5 py-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 pt-4">
        <h3 className="font-semibold text-foreground text-base leading-snug text-balance">{project.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{project.description}</p>

        {/* Tech stack */}
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 font-mono text-xs text-muted-foreground">
          {project.tech_stack.map((tech, techIndex) => (
            <span key={tech} className="flex items-center gap-2">
              {techIndex > 0 && <span className="text-border" aria-hidden="true">/</span>}
              {tech}
            </span>
          ))}
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 pt-2 mt-1 border-t border-border">
          <Link
            href={`/projects/${project.id}`}
            aria-label={`View details of ${project.title}`}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-3"
          >
            <Eye size={13} />
            Detail
          </Link>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.title}`}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-3"
            >
              <ExternalLink size={13} />
              Demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source code of ${project.title}`}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-3"
            >
              <Github size={13} />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
