export interface HeroSectionContent {
  headline: string;
  description: string;
  name: string;
  role: string;
  domainLabel: string;
  domainLogoUrl?: string | null;
  techTags: string[];
  cvUrl: string;
  avatarUrl?: string | null;
  avatarAlt: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  statusBadgeDetail: string;
  openToWork: boolean;
}

export const defaultHeroContent: HeroSectionContent = {
  headline: "Crafting digital experiences that matter",
  description: "Gue suka ngulik dari UI/UX sampai ke arsitektur backend.",
  name: "Your Name",
  role: "web developer",
  domainLabel: "yourname.dev",
  domainLogoUrl: null,
  techTags: ["React", "Laravel", "TypeScript", "Tailwind CSS", "Next.js"],
  cvUrl: "/cv.pdf",
  avatarUrl: "/images/hero-avatar.jpg",
  avatarAlt: "Your Name — Web Developer",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  statusBadgeDetail: "status",
  openToWork: true,
};

interface HeroSectionRecordLike {
  headline?: string | null;
  description?: string | null;
  domainLogoUrl?: string | null;
  domainLabel?: string | null;
  name?: string | null;
  role?: string | null;
  techTags?: unknown;
  cvUrl?: string | null;
  avatarUrl?: string | null;
  avatarAlt?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  statusBadgeDetail?: string | null;
  openToWork?: boolean | null;
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultHeroContent.techTags;
  }

  const tags = value.map((tag) => String(tag).trim()).filter(Boolean);
  return tags.length > 0 ? tags.slice(0, 8) : defaultHeroContent.techTags;
}

export function normalizeHeroContent(record?: HeroSectionRecordLike | null): HeroSectionContent {
  if (!record) {
    return defaultHeroContent;
  }

  return {
    headline: record.headline?.trim() || defaultHeroContent.headline,
    description: record.description?.trim() || defaultHeroContent.description,
    name: record.name?.trim() || defaultHeroContent.name,
    role: record.role?.trim() || defaultHeroContent.role,
    domainLabel: record.domainLabel?.trim() || defaultHeroContent.domainLabel,
    domainLogoUrl: record.domainLogoUrl?.trim() || defaultHeroContent.domainLogoUrl,
    techTags: normalizeTags(record.techTags),
    cvUrl: record.cvUrl?.trim() || defaultHeroContent.cvUrl,
    avatarUrl: record.avatarUrl?.trim() || defaultHeroContent.avatarUrl,
    avatarAlt: record.avatarAlt?.trim() || defaultHeroContent.avatarAlt,
    githubUrl: record.githubUrl?.trim() || defaultHeroContent.githubUrl,
    linkedinUrl: record.linkedinUrl?.trim() || defaultHeroContent.linkedinUrl,
    twitterUrl: record.twitterUrl?.trim() || defaultHeroContent.twitterUrl,
    statusBadgeDetail: record.statusBadgeDetail?.trim() || defaultHeroContent.statusBadgeDetail,
    openToWork: record.openToWork ?? defaultHeroContent.openToWork,
  };
}
