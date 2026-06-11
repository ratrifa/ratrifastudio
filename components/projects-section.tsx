import { ProjectCard, type Project } from "@/components/project-card";
import { SectionHeading, AccentWords } from "@/components/section-heading";
import { Reveal } from "@/components/ui/reveal";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="02"
          label="Selected Work"
          meta={`(${projects.length})`}
          title={<AccentWords text="Things I've built" />}
          description="Beberapa proyek yang pernah gua kerjain, mulai dari side project sampai produk yang udah live."
        />

        {projects.length > 0 ? (
          <>
            {featured && (
              <Reveal>
                <ProjectCard project={featured} index={0} featured />
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
                {rest.map((project, index) => (
                  <Reveal key={project.id} delay={Math.min(index * 0.06, 0.3)}>
                    <ProjectCard project={project} index={index + 1} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-center py-16">
            No projects yet.
          </p>
        )}
      </div>
    </section>
  );
}
