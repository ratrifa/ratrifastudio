import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { CertificateSection } from "@/components/certificate-section";
import { Footer } from "@/components/footer";
import type { Project } from "@/components/project-card";
import type { Experience } from "@/components/experience-section";
import type { Certificate } from "@/components/certificate-section";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { normalizeHeroContent } from "@/lib/hero-content";
import { normalizeAboutContent } from "@/lib/about-content";
import { applyDerivedStats, getExperienceValue, getProjectValue } from "@/lib/about-stats";
import { normalizeExperienceType } from "@/lib/experience-types";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    let projectsDb: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
    let experiencesDb: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
    let certificatesDb: Awaited<ReturnType<typeof prisma.certificate.findMany>> = [];
    let heroDb: Parameters<typeof normalizeHeroContent>[0] = null;
    let aboutDb: Parameters<typeof normalizeAboutContent>[0] = null;
    let totalProjects = 0;
    const heroClient = prisma as typeof prisma & {
      heroSection: {
        findUnique: (args: { where: { id: string } }) => Promise<Parameters<typeof normalizeHeroContent>[0]>;
      };
    };
    const aboutClient = prisma as typeof prisma & {
      aboutSection: {
        findUnique: (args: { where: { id: string } }) => Promise<Parameters<typeof normalizeAboutContent>[0]>;
      };
    };

    if (process.env.DATABASE_URL) {
      try {
        [projectsDb, experiencesDb, certificatesDb, totalProjects] = await prisma.$transaction([
          prisma.project.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
          }),
          prisma.experience.findMany({
            orderBy: { periodStart: "desc" },
          }),
          prisma.certificate.findMany({
            orderBy: [{ featured: "desc" }, { issueDate: "desc" }],
          }),
          prisma.project.count(),
        ]);
      } catch {
        projectsDb = [];
        experiencesDb = [];
        certificatesDb = [];
        totalProjects = 0;
      }

      try {
        heroDb = await heroClient.heroSection.findUnique({ where: { id: "home" } });
      } catch {
        heroDb = null;
      }

      try {
        aboutDb = await aboutClient.aboutSection.findUnique({ where: { id: "home" } });
      } catch {
        aboutDb = null;
      }
    }

    const projects: Project[] = projectsDb.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.imageUrl ?? "/images/project-1.jpg",
      tech_stack: Array.isArray(project.techStack) ? project.techStack.map(String) : [],
      demo_url: project.link ?? undefined,
      repo_url: project.githubUrl ?? undefined,
    }));

    const experiences: Experience[] = experiencesDb.map((experience) => ({
      id: experience.id,
      role: experience.title,
      company: experience.company,
      experienceType: normalizeExperienceType(experience.experienceType),
      period_start: experience.periodStart.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      period_end: experience.periodEnd
        ? experience.periodEnd.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : null,
      description: experience.description,
    }));

    const certificates: Certificate[] = certificatesDb.map((certificate) => ({
      id: certificate.id,
      title: certificate.title,
      issuer: certificate.issuer,
      issued_at: certificate.issueDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      image: certificate.imageUrl ?? "/images/certificate-featured.jpg",
      credential_url: certificate.credentialUrl ?? undefined,
      featured: certificate.featured,
    }));
    const hero = normalizeHeroContent(heroDb);
    const about = normalizeAboutContent(aboutDb);
    const aboutWithDerivedStats = {
      ...about,
      stats: applyDerivedStats(about.stats, {
        experienceValue: getExperienceValue(experiencesDb),
        projectValue: getProjectValue(totalProjects),
      }),
    };

    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar domainLabel={hero.domainLabel} domainLogoUrl={hero.domainLogoUrl} />
        <HeroSection content={hero} />
        <AboutSection content={aboutWithDerivedStats} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <CertificateSection certificates={certificates} />
        <Footer
          social={{
            githubUrl: hero.githubUrl,
            linkedinUrl: hero.linkedinUrl,
            twitterUrl: hero.twitterUrl,
          }}
          brand={{
            domainLabel: hero.domainLabel,
            domainLogoUrl: hero.domainLogoUrl,
          }}
        />
      </main>
    );
  } finally {
    await cleanupPrisma();
  }
}
