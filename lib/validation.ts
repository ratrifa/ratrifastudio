import { z } from "zod";

import { ABOUT_SKILL_ICON_KEYS } from "@/lib/about-skill-icons";

const optionalUrl = z
  .string()
  .trim()
  .url("URL tidak valid")
  .or(z.literal(""))
  .transform((value) => (value ? value : null));

export const loginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email tidak valid")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password wajib diisi"),
});

export const projectFormSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(120),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(2000),
  link: optionalUrl,
  githubUrl: optionalUrl,
  techStackRaw: z.string().trim().min(1, "Tech stack wajib diisi").max(300),
  isPublished: z.boolean(),
});

export const projectUpdateSchema = projectFormSchema.extend({
  id: z.string().uuid("ID project tidak valid"),
});

const experienceBaseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(120),
  periodStart: z.string().trim().min(1),
  periodEnd: z.string().trim().optional(),
  description: z.string().trim().min(10).max(2000),
});

function withExperienceDateValidation<T extends z.ZodTypeAny>(schema: T) {
  return schema.refine((data: any) => {
    if (!data.periodEnd) {
      return true;
    }
    return new Date(data.periodEnd).getTime() >= new Date(data.periodStart).getTime();
  }, "Tanggal akhir harus sama atau setelah tanggal mulai");
}

export const experienceFormSchema = withExperienceDateValidation(experienceBaseSchema);

export const experienceUpdateSchema = withExperienceDateValidation(
  experienceBaseSchema.extend({
    id: z.string().uuid(),
  }),
);

export const certificateFormSchema = z.object({
  title: z.string().trim().min(3).max(160),
  issuer: z.string().trim().min(2).max(160),
  issueDate: z.string().trim().min(1),
  imageUrl: z.string().optional().nullable(),
  credentialUrl: optionalUrl,
  featured: z.boolean(),
});

export const certificateUpdateSchema = certificateFormSchema.extend({
  id: z.string().uuid(),
});

export const heroSectionFormSchema = z.object({
  headline: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(1000),
  name: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(80),
  domainLabel: z.string().trim().min(2).max(80),
  techTagsRaw: z.string().trim().min(1).max(240),
  avatarAlt: z.string().trim().min(1).max(120),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  statusBadgeDetail: z.string().trim().min(1).max(80),
  openToWork: z.boolean(),
});

export const heroSectionUpdateSchema = heroSectionFormSchema;

export const aboutSectionFormSchema = z.object({
  headline: z.string().trim().min(3).max(191),
  paragraph: z.string().trim().min(20).max(3000),
  stats: z
    .array(
      z.object({
        value: z.string().trim().min(1).max(16),
        label: z.string().trim().min(1).max(40),
      }),
    )
    .max(6),
  skills: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(40),
        icon: z.enum(ABOUT_SKILL_ICON_KEYS),
        itemsRaw: z.string().trim().min(1).max(240),
      }),
    )
    .min(1)
    .max(8),
});

export const aboutSectionUpdateSchema = aboutSectionFormSchema;

export function toTechStack(rawValue: string) {
  const unique = new Set<string>();

  for (const token of rawValue.split(",")) {
    const cleaned = token.trim();
    if (!cleaned) {
      continue;
    }
    unique.add(cleaned);
  }

  return Array.from(unique).slice(0, 16);
}

export function toTagList(rawValue: string) {
  const unique = new Set<string>();

  for (const token of rawValue.split(",")) {
    const cleaned = token.trim();
    if (!cleaned) {
      continue;
    }
    unique.add(cleaned);
  }

  return Array.from(unique).slice(0, 8);
}

export function toCommaList(rawValue: string, maxItems = 8) {
  const unique = new Set<string>();

  for (const token of rawValue.split(",")) {
    const cleaned = token.trim();
    if (!cleaned) {
      continue;
    }
    unique.add(cleaned);
  }

  return Array.from(unique).slice(0, maxItems);
}

export function safeDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Tanggal tidak valid");
  }
  return date;
}
