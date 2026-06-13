import { cacheLife } from "next/cache";
import { API_BASE_URL } from "@/lib/api";
import { HomeClient } from "@/components/home-client";
import { normalizeExperienceType } from "@/lib/experience-types";
import type { HomeData } from "@/lib/home-data";
import type { HeroSectionContent } from "@/lib/hero-content";
import type { AboutSectionContent } from "@/lib/about-content";
import type { Project } from "@/components/project-card";
import type { Experience } from "@/components/experience-section";
import type { Certificate } from "@/components/certificate-section";

async function publicGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return res.json() as Promise<T>;
  } catch {}
  return null;
}

interface ProjectApi {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  link: string | null;
  githubUrl: string | null;
  views?: number;
}

interface ExperienceApi {
  id: string;
  title: string;
  company: string;
  experienceType: string | null;
  category: string | null;
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

async function fetchHomeData(): Promise<HomeData | null> {
  "use cache";
  cacheLife({ revalidate: 60, stale: 300 });

  const [projectsData, experiencesData, certificatesData, hero, about] = await Promise.all([
    publicGet<ProjectApi[]>("/api/projects"),
    publicGet<ExperienceApi[]>("/api/experiences"),
    publicGet<CertificateApi[]>("/api/certificates"),
    publicGet<HeroSectionContent>("/api/hero"),
    publicGet<AboutSectionContent>("/api/about"),
  ]);

  if (!hero || !about || !projectsData || !experiencesData || !certificatesData) {
    return null;
  }

  const projects: Project[] = projectsData.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.imageUrl ?? "/images/project-1.jpg",
    tech_stack: Array.isArray(p.techStack) ? p.techStack.map(String) : [],
    demo_url: p.link ?? undefined,
    repo_url: p.githubUrl ?? undefined,
    views: p.views,
  }));

  const experiences: Experience[] = experiencesData
    .map((e) => ({
      id: e.id,
      role: e.title,
      company: e.company,
      experienceType: normalizeExperienceType(e.experienceType),
      category: e.category ?? undefined,
      period_start: monthYear(e.periodStart, "short"),
      period_end: e.periodEnd ? monthYear(e.periodEnd, "short") : null,
      description: e.description,
      photos: e.photos ?? [],
    }))
    .reverse();

  const certificates: Certificate[] = certificatesData.map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    issued_at: monthYear(c.issueDate, "long"),
    image: c.imageUrl ?? "/images/certificate-featured.jpg",
    credential_url: c.credentialUrl ?? undefined,
    featured: c.featured,
  }));

  return { hero, about, projects, experiences, certificates };
}

export default async function Home() {
  const data = await fetchHomeData();
  return <HomeClient data={data} />;
}
