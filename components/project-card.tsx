import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ArrowUpRight, ExternalLink, Github, Eye } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech_stack: string[];
  demo_url?: string;
  repo_url?: string;
  views?: number;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  /** Layout featured lebar untuk projects[0] — index global tetap lewat `index`. */
  featured?: boolean;
}

const MAX_VISIBLE_TECH = 5;

function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  if (!project.demo_url && !project.repo_url) return null;

  return (
    <div className={className}>
      {project.demo_url && (
        <a
          href={project.demo_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Live demo of ${project.title}`}
          className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ExternalLink className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          Demo
        </a>
      )}
      {project.repo_url && (
        <a
          href={project.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source code of ${project.title}`}
          className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Github className="size-4" />
          Code
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ project, index = 0, featured = false }: ProjectCardProps) {
  const indexLabel = String(index + 1).padStart(2, "0");
  const detailHref = `/projects/${project.id}`;

  if (featured) {
    return (
      <article className="group mb-20 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <Link
          href={detailHref}
          prefetch={true}
          aria-label={`View details of ${project.title}`}
          className="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border lg:col-span-7"
        >
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            fill
            className="object-cover img-hover-zoom"
          />
        </Link>

        <div className="lg:col-span-5">
          <p className="font-mono text-xs text-primary">{indexLabel}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
            <Link href={detailHref} prefetch={true} className="transition-colors hover:text-primary">
              {project.title}
            </Link>
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground line-clamp-3">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <ProjectLinks project={project} className="flex gap-5" />
            {(project.views ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="size-3.5" />
                {project.views!.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  const visibleTech = project.tech_stack.slice(0, MAX_VISIBLE_TECH);
  const extraTech = project.tech_stack.length - visibleTech.length;

  return (
    <article className="flex flex-col">
      <Link
        href={detailHref}
        prefetch={true}
        aria-label={`View details of ${project.title}`}
        className="group relative block aspect-[16/11] overflow-hidden rounded-xl border border-border"
      >
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          fill
          className="object-cover img-hover-zoom"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[11px] text-foreground backdrop-blur">
          {indexLabel}
        </span>
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      <div className="mt-5">
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          <Link href={detailHref} prefetch={true} className="group inline-flex items-start gap-1.5 transition-colors hover:text-primary">
            <span className="text-balance">{project.title}</span>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{project.description}</p>

        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          {visibleTech.map((tech, techIndex) => (
            <span key={tech} className="flex items-center gap-2">
              {techIndex > 0 && (
                <span className="text-border" aria-hidden="true">
                  ·
                </span>
              )}
              {tech}
            </span>
          ))}
          {extraTech > 0 && (
            <span className="flex items-center gap-2">
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              +{extraTech}
            </span>
          )}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <ProjectLinks project={project} className="flex gap-5" />
          {(project.views ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="size-3.5" />
              {project.views!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
