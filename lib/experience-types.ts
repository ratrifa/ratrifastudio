export const EXPERIENCE_TYPE_OPTIONS = ["organization", "volunteer", "full-time", "part-time", "internship", "contract", "freelance"] as const;

export type ExperienceTypeValue = (typeof EXPERIENCE_TYPE_OPTIONS)[number];

export const EXPERIENCE_TYPE_LABELS: Record<ExperienceTypeValue, string> = {
  organization: "Organization",
  volunteer: "Volunteer",
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
};

export const EXPERIENCE_TYPE_TO_DB = {
  organization: "ORGANIZATION",
  volunteer: "VOLUNTEER",
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  internship: "INTERNSHIP",
  contract: "CONTRACT",
  freelance: "FREELANCE",
} as const;

export const DB_EXPERIENCE_TYPE_TO_APP = {
  ORGANIZATION: "organization",
  VOLUNTEER: "volunteer",
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  INTERNSHIP: "internship",
  CONTRACT: "contract",
  FREELANCE: "freelance",
} as const;

export type DbExperienceType = (typeof EXPERIENCE_TYPE_TO_DB)[ExperienceTypeValue];

export function toDbExperienceType(value: ExperienceTypeValue): DbExperienceType {
  return EXPERIENCE_TYPE_TO_DB[value];
}

export function normalizeExperienceType(value: string | null | undefined): ExperienceTypeValue | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  if (normalized in DB_EXPERIENCE_TYPE_TO_APP) {
    return DB_EXPERIENCE_TYPE_TO_APP[normalized as keyof typeof DB_EXPERIENCE_TYPE_TO_APP];
  }

  const lower = normalized.toLowerCase();
  return EXPERIENCE_TYPE_OPTIONS.find((item) => item === lower);
}
