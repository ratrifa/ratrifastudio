"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { CertificateSection } from "@/components/certificate-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { LoadingScreen } from "@/components/loading-screen";
import { apiUrl } from "@/lib/api";
import { defaultHeroContent, type HeroSectionContent } from "@/lib/hero-content";
import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";
import { normalizeExperienceType } from "@/lib/experience-types";
import type { Project } from "@/components/project-card";
import type { Experience } from "@/components/experience-section";
import type { Certificate } from "@/components/certificate-section";

const SESSION_KEY = "rf_splash_played";
const SPLASH_DURATION_MS = 8500;
const FADE_MS = 400;
const FETCH_TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;

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

interface HomeData {
  hero: HeroSectionContent;
  about: AboutSectionContent;
  projects: Project[];
  experiences: Experience[];
  certificates: Certificate[];
}

function monthYear(iso: string, month: "short" | "long") {
  return new Date(iso).toLocaleDateString("en-US", { month, year: "numeric" });
}

async function fetchWithRetry<T>(path: string): Promise<T | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(apiUrl(path), { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return (await res.json()) as T;
      if (res.status < 500) return null;
    } catch {}
    if (attempt < MAX_RETRIES) {
      await new Promise<void>((r) => setTimeout(r, 1200 * (attempt + 1)));
    }
  }
  return null;
}

async function fetchHomeData(): Promise<HomeData> {
  const [projectsData, experiencesData, certificatesData, hero, about] = await Promise.all([
    fetchWithRetry<ProjectApi[]>("/api/projects"),
    fetchWithRetry<ExperienceApi[]>("/api/experiences"),
    fetchWithRetry<CertificateApi[]>("/api/certificates"),
    fetchWithRetry<HeroSectionContent>("/api/hero"),
    fetchWithRetry<AboutSectionContent>("/api/about"),
  ]);

  const projects: Project[] = (projectsData ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.imageUrl ?? "/images/project-1.jpg",
    tech_stack: Array.isArray(p.techStack) ? p.techStack.map(String) : [],
    demo_url: p.link ?? undefined,
    repo_url: p.githubUrl ?? undefined,
  }));

  const experiences: Experience[] = (experiencesData ?? [])
    .map((e) => ({
      id: e.id,
      role: e.title,
      company: e.company,
      experienceType: normalizeExperienceType(e.experienceType),
      period_start: monthYear(e.periodStart, "short"),
      period_end: e.periodEnd ? monthYear(e.periodEnd, "short") : null,
      description: e.description,
      photos: e.photos ?? [],
    }))
    .reverse();

  const certificates: Certificate[] = (certificatesData ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    issued_at: monthYear(c.issueDate, "long"),
    image: c.imageUrl ?? "/images/certificate-featured.jpg",
    credential_url: c.credentialUrl ?? undefined,
    featured: c.featured,
  }));

  return {
    hero: hero ?? defaultHeroContent,
    about: about ?? defaultAboutContent,
    projects,
    experiences,
    certificates,
  };
}

export function HomeClient() {
  const [data, setData] = useState<HomeData | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);

  useLayoutEffect(() => {
    let isFirstVisit = false;
    try {
      isFirstVisit = !sessionStorage.getItem(SESSION_KEY);
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    if (!isFirstVisit) {
      fetchHomeData().then((d) => {
        setData(d);
        setRevealed(true);
      });
      return;
    }

    // First visit: wait for both animation timer and data
    let dataReady = false;
    let timerDone = false;
    let revealCalled = false;

    const tryReveal = () => {
      if (dataReady && timerDone && !revealCalled) {
        revealCalled = true;
        setRevealed(true);
      }
    };

    fetchHomeData().then((d) => {
      setData(d);
      dataReady = true;
      tryReveal();
    });

    const timer = setTimeout(() => {
      timerDone = true;
      tryReveal();
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!revealed || !overlayMounted) return;
    const t = setTimeout(() => setOverlayMounted(false), FADE_MS);
    return () => clearTimeout(t);
  }, [revealed, overlayMounted]);

  return (
    <>
      {revealed && data && (
        <PageTransition>
          <main className="min-h-screen bg-background text-foreground">
            <Navbar domainLabel={data.hero.domainLabel} domainLogoUrl={data.hero.domainLogoUrl} />
            <HeroSection content={data.hero} />
            <AboutSection content={data.about} />
            <ProjectsSection projects={data.projects} />
            <ExperienceSection experiences={data.experiences} />
            <CertificateSection certificates={data.certificates} />
            <ContactSection
              social={{
                githubUrl: data.hero.githubUrl,
                linkedinUrl: data.hero.linkedinUrl,
                twitterUrl: data.hero.twitterUrl,
              }}
            />
            <Footer
              social={{
                githubUrl: data.hero.githubUrl,
                linkedinUrl: data.hero.linkedinUrl,
                twitterUrl: data.hero.twitterUrl,
              }}
              brand={{
                domainLabel: data.hero.domainLabel,
                domainLogoUrl: data.hero.domainLogoUrl,
              }}
            />
          </main>
        </PageTransition>
      )}
      {overlayMounted && (
        <div
          className="fixed inset-0 z-50 transition-opacity ease-out"
          style={{ opacity: revealed ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
        >
          <LoadingScreen />
        </div>
      )}
    </>
  );
}
