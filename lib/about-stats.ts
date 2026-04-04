import type { AboutStat } from "@/lib/about-content";

export interface AboutDerivedMetrics {
  experienceValue: string;
  projectValue: string;
}

const EXPERIENCE_LABEL_PATTERN = /(experience|exp\.?|pengalaman)/i;
const PROJECT_LABEL_PATTERN = /(project|projects|projek)/i;

export function isDerivedStatLabel(label: string) {
  const trimmed = label.trim();
  return EXPERIENCE_LABEL_PATTERN.test(trimmed) || PROJECT_LABEL_PATTERN.test(trimmed);
}

function diffInMonths(start: Date, end: Date) {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const total = years * 12 + months;
  return total > 0 ? total : 0;
}

export function getExperienceValue(experiences: Array<{ periodStart: Date; periodEnd: Date | null }>) {
  const now = new Date();
  const totalMonths = experiences.reduce((sum, item) => {
    const periodEnd = item.periodEnd ?? now;
    return sum + diffInMonths(item.periodStart, periodEnd);
  }, 0);

  const years = Math.max(1, Math.round(totalMonths / 12));
  return `${years}+`;
}

export function getProjectValue(totalProjects: number) {
  if (totalProjects > 10) {
    const rounded = Math.floor(totalProjects / 5) * 5;
    return `${rounded}+`;
  }

  return `${Math.max(0, totalProjects)}+`;
}

export function applyDerivedStats(stats: AboutStat[], metrics: AboutDerivedMetrics) {
  return stats.map((stat) => {
    const label = stat.label.trim();

    if (EXPERIENCE_LABEL_PATTERN.test(label)) {
      return { ...stat, value: metrics.experienceValue };
    }

    if (PROJECT_LABEL_PATTERN.test(label)) {
      return { ...stat, value: metrics.projectValue };
    }

    return stat;
  });
}

export function getDerivedValueForLabel(label: string, metrics: AboutDerivedMetrics) {
  const trimmed = label.trim();

  if (EXPERIENCE_LABEL_PATTERN.test(trimmed)) {
    return metrics.experienceValue;
  }

  if (PROJECT_LABEL_PATTERN.test(trimmed)) {
    return metrics.projectValue;
  }

  return null;
}
