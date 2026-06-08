import { ProjectCard, type Project } from "@/components/project-card"

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header — editorial masthead */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 pb-6 border-b border-border">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">01 — Selected work</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Things I&apos;ve built
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed sm:text-right">
            Beberapa proyek yang pernah gue kerjain — dari side project sampai produk yang udah live.
          </p>
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-16">
            No projects yet.
          </p>
        )}
      </div>
    </section>
  )
}
