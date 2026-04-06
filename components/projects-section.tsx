import { ProjectCard, type Project } from "@/components/project-card"
import { Layers } from "lucide-react"

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Layers size={16} />
            </span>
            <span className="text-primary font-mono text-sm tracking-widest uppercase">
              Projects
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Things I&apos;ve built
          </h2>
          <p className="text-muted-foreground max-w-lg leading-relaxed">
            Beberapa proyek yang pernah gue kerjain — dari side project sampai
            produk yang udah live. Setiap proyek adalah kesempatan buat belajar
            sesuatu yang baru.
          </p>
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
