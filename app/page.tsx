import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { CertificateSection } from "@/components/certificate-section";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";
import type { Project } from "@/components/project-card";
import type { Experience } from "@/components/experience-section";
import type { Certificate } from "@/components/certificate-section";
import { PageTransition } from "@/components/page-transition";
import { apiGet } from "@/lib/api-server";
import { defaultHeroContent, type HeroSectionContent } from "@/lib/hero-content";
import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";
import { normalizeExperienceType } from "@/lib/experience-types";

export const dynamic = "force-dynamic";

interface ProjectApi {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  link: string | null;
  githubUrl: string | null;
}

interface ExperienceApi {
  id: string;
  title: string;
  company: string;
  experienceType: string | null;
  periodStart: string;
  periodEnd: string | null;
  description: string;
  photos: { id: string; imageUrl: string; caption?: string | null }[];
}

interface CertificateApi {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  imageUrl: string | null;
  credentialUrl: string | null;
  featured: boolean;
}

function monthYear(iso: string, month: "short" | "long") {
  return new Date(iso).toLocaleDateString("en-US", { month, year: "numeric" });
}

export default async function Home() {
  const [projectsData, experiencesData, certificatesData, hero, about] = await Promise.all([
    apiGet<ProjectApi[]>("/api/projects"),
    apiGet<ExperienceApi[]>("/api/experiences"),
    apiGet<CertificateApi[]>("/api/certificates"),
    apiGet<HeroSectionContent>("/api/hero"),
    apiGet<AboutSectionContent>("/api/about"),
  ]);

  const projects: Project[] = (projectsData ?? []).map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.imageUrl ?? "/images/project-1.jpg",
    tech_stack: Array.isArray(project.techStack) ? project.techStack.map(String) : [],
    demo_url: project.link ?? undefined,
    repo_url: project.githubUrl ?? undefined,
  }));

  // The API returns experiences oldest-first; the landing page shows newest-first.
  const experiences: Experience[] = (experiencesData ?? [])
    .map((experience) => ({
      id: experience.id,
      role: experience.title,
      company: experience.company,
      experienceType: normalizeExperienceType(experience.experienceType),
      period_start: monthYear(experience.periodStart, "short"),
      period_end: experience.periodEnd ? monthYear(experience.periodEnd, "short") : null,
      description: experience.description,
      photos: experience.photos ?? [],
    }))
    .reverse();

  const certificates: Certificate[] = (certificatesData ?? []).map((certificate) => ({
    id: certificate.id,
    title: certificate.title,
    issuer: certificate.issuer,
    issued_at: monthYear(certificate.issueDate, "long"),
    image: certificate.imageUrl ?? "/images/certificate-featured.jpg",
    credential_url: certificate.credentialUrl ?? undefined,
    featured: certificate.featured,
  }));

  // The /api/hero and /api/about endpoints already return normalised content
  // (about with its live-derived stats applied).
  const heroContent = hero ?? defaultHeroContent;
  const aboutContent = about ?? defaultAboutContent;

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
        <Navbar domainLabel={heroContent.domainLabel} domainLogoUrl={heroContent.domainLogoUrl} />
        <HeroSection content={heroContent} />
        <AboutSection content={aboutContent} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <CertificateSection certificates={certificates} />
        <ContactSection
          social={{
            githubUrl: heroContent.githubUrl,
            linkedinUrl: heroContent.linkedinUrl,
            twitterUrl: heroContent.twitterUrl,
          }}
        />
        <Footer
          social={{
            githubUrl: heroContent.githubUrl,
            linkedinUrl: heroContent.linkedinUrl,
            twitterUrl: heroContent.twitterUrl,
          }}
          brand={{
            domainLabel: heroContent.domainLabel,
            domainLogoUrl: heroContent.domainLogoUrl,
          }}
        />
      </main>
    </PageTransition>
  );
}
