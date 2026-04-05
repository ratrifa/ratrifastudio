import { ABOUT_SKILL_ICON_DEFAULT, type AboutSkillIconKey, isAboutSkillIconKey } from "@/lib/about-skill-icons";

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutSkill {
  title: string;
  icon: AboutSkillIconKey;
  items: string[];
}

export interface AboutSectionContent {
  headline: string;
  paragraph: string;
  stats: AboutStat[];
  skills: AboutSkill[];
}

export const defaultAboutContent: AboutSectionContent = {
  headline: "Passionate about the web, obsessed with craft",
  paragraph:
    "Gue adalah seorang web developer yang passionate dalam membangun aplikasi web modern yang tidak hanya fungsional, tapi juga memiliki user experience yang luar biasa. Gue percaya bahwa kode yang bagus adalah kode yang bisa dibaca, dimengerti, dan di-maintain.\n\nPerjalanan gue di dunia web development dimulai dari rasa penasaran terhadap bagaimana sebuah website bisa terlihat semenarik itu. Dari sana, gue terus belajar, bereksperimen, dan akhirnya bikin produk nyata yang dipakai orang beneran.\n\nDi luar coding, gue suka ngulik desain UI, baca artikel tech, dan sesekali nulis tentang pengalaman gue di blog.",
  stats: [
    { value: "3+", label: "Years Exp." },
    { value: "20+", label: "Projects" },
    { value: "10+", label: "Clients" },
  ],
  skills: [
    { title: "Frontend", icon: "code", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { title: "Backend", icon: "server", items: ["Laravel", "Node.js", "PostgreSQL", "REST API"] },
    { title: "Design", icon: "palette", items: ["Figma", "UI/UX", "Responsive Design", "Accessibility"] },
    { title: "Soft Skills", icon: "users", items: ["Teamwork", "Problem Solving", "Fast Learner", "Communication"] },
  ],
};

interface AboutSectionRecordLike {
  headline?: string | null;
  paragraph?: string | null;
  stats?: unknown;
  skills?: unknown;
}

function normalizeStats(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultAboutContent.stats;
  }

  const parsed = value
    .map((item) => {
      const valueText = String((item as { value?: unknown }).value ?? "").trim();
      const labelText = String((item as { label?: unknown }).label ?? "").trim();
      if (!valueText || !labelText) {
        return null;
      }
      return { value: valueText, label: labelText };
    })
    .filter(Boolean) as AboutStat[];

  return parsed.length > 0 ? parsed.slice(0, 8) : defaultAboutContent.stats;
}

function normalizeSkills(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultAboutContent.skills;
  }

  const parsed = value
    .map((item, index) => {
      const title = String((item as { title?: unknown }).title ?? "").trim();
      const rawIcon = String((item as { icon?: unknown }).icon ?? "").trim();
      const rawItems = Array.isArray((item as { items?: unknown[] }).items) ? (item as { items: unknown[] }).items : [];
      const items = rawItems
        .map((entry) => String(entry).trim())
        .filter(Boolean)
        .slice(0, 10);
      const fallbackIcon = defaultAboutContent.skills[index % defaultAboutContent.skills.length]?.icon ?? ABOUT_SKILL_ICON_DEFAULT;
      const icon = isAboutSkillIconKey(rawIcon) ? rawIcon : fallbackIcon;

      if (!title || items.length === 0) {
        return null;
      }

      return { title, icon, items };
    })
    .filter(Boolean) as AboutSkill[];

  return parsed.length > 0 ? parsed.slice(0, 8) : defaultAboutContent.skills;
}

export function normalizeAboutContent(record?: AboutSectionRecordLike | null): AboutSectionContent {
  if (!record) {
    return defaultAboutContent;
  }

  return {
    headline: record.headline?.trim() || defaultAboutContent.headline,
    paragraph: record.paragraph?.trim() || defaultAboutContent.paragraph,
    stats: normalizeStats(record.stats),
    skills: normalizeSkills(record.skills),
  };
}
