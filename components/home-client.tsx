"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useTrackVisit } from "@/lib/use-track-visit";

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
import type { HomeData } from "@/lib/home-data";

const SESSION_KEY = "rf_splash_played";
const SPLASH_DURATION_MS = 8500;
const FADE_MS = 400;

export function HomeClient({ data }: { data: HomeData | null }) {
  useTrackVisit("/");

  const [revealed, setRevealed] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);

  useLayoutEffect(() => {
    let isFirstVisit = false;
    try {
      isFirstVisit = !sessionStorage.getItem(SESSION_KEY);
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    if (!isFirstVisit) {
      setRevealed(true);
      return;
    }

    // First visit: wait for splash animation before revealing content.
    const timer = setTimeout(() => setRevealed(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!revealed || !overlayMounted) return;
    const t = setTimeout(() => setOverlayMounted(false), FADE_MS);
    return () => clearTimeout(t);
  }, [revealed, overlayMounted]);

  return (
    <>
      {revealed && !data && (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-2">
            <p className="text-base font-medium">Data gagal dimuat</p>
            <p className="text-sm text-muted-foreground">Restart ulang browser Anda dan coba lagi.</p>
          </div>
        </div>
      )}
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
