import type { HeroSectionContent } from "@/lib/hero-content";
import type { AboutSectionContent } from "@/lib/about-content";
import type { Project } from "@/components/project-card";
import type { Experience } from "@/components/experience-section";
import type { Certificate } from "@/components/certificate-section";

export interface HomeData {
  hero: HeroSectionContent;
  about: AboutSectionContent;
  projects: Project[];
  experiences: Experience[];
  certificates: Certificate[];
}
