import { revalidatePath } from "next/cache";

import { AboutSectionManager } from "@/components/admin/about-section-manager";
import type { FormState } from "@/lib/form-state";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { aboutSectionFormSchema, toCommaList } from "@/lib/validation";
import { defaultAboutContent, normalizeAboutContent } from "@/lib/about-content";
import { applyDerivedStats, getExperienceValue, getProjectValue, isDerivedStatLabel, type AboutDerivedMetrics } from "@/lib/about-stats";

const ABOUT_ID = "home";
type AboutRecord = {
  id: string;
  headline: string | null;
  paragraph: string | null;
  stats: unknown;
  skills: unknown;
};

async function findAboutRecordById(id: string): Promise<AboutRecord | null> {
  const rows = await prisma.$queryRaw<AboutRecord[]>`
    SELECT id, headline, paragraph, stats, skills
    FROM AboutSection
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

async function upsertAboutRecord(args: { id: string; headline: string; paragraph: string; stats: unknown; skills: unknown }) {
  const statsJson = JSON.stringify(args.stats);
  const skillsJson = JSON.stringify(args.skills);

  await prisma.$executeRaw`
    INSERT INTO AboutSection (id, headline, paragraph, stats, skills, createdAt, updatedAt)
    VALUES (${args.id}, ${args.headline}, ${args.paragraph}, ${statsJson}, ${skillsJson}, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      headline = VALUES(headline),
      paragraph = VALUES(paragraph),
      stats = VALUES(stats),
      skills = VALUES(skills),
      updatedAt = NOW()
  `;
}

const errorState = (message: string, fieldErrors?: Record<string, string[] | undefined>): FormState => ({
  status: "error",
  message,
  fieldErrors,
});

const successState = (message: string): FormState => ({
  status: "success",
  message,
});

async function getDerivedMetrics(): Promise<AboutDerivedMetrics> {
  if (!process.env.DATABASE_URL) {
    return {
      experienceValue: defaultAboutContent.stats[0]?.value ?? "1+",
      projectValue: defaultAboutContent.stats[1]?.value ?? "0+",
    };
  }

  try {
    const [totalProjects, experiences] = await Promise.all([
      prisma.project.count(),
      prisma.experience.findMany({
        select: {
          periodStart: true,
          periodEnd: true,
        },
      }),
    ]);

    return {
      experienceValue: getExperienceValue(experiences),
      projectValue: getProjectValue(totalProjects),
    };
  } catch {
    return {
      experienceValue: defaultAboutContent.stats[0]?.value ?? "1+",
      projectValue: defaultAboutContent.stats[1]?.value ?? "0+",
    };
  }
}

async function saveAboutSectionAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const statLabels = formData
      .getAll("statLabel")
      .map((entry) => String(entry).trim())
      .filter(Boolean);
    const statValues = formData
      .getAll("statValue")
      .map((entry) => String(entry).trim())
      .filter(Boolean);
    const stats = statLabels
      .map((label, index) => ({
        label,
        value: statValues[index] ?? "",
      }))
      .filter((stat) => !isDerivedStatLabel(stat.label));
    const skillTitles = formData
      .getAll("skillTitle")
      .map((entry) => String(entry).trim())
      .filter(Boolean);
    const skillItemsRawValues = formData
      .getAll("skillItemsRaw")
      .map((entry) => String(entry).trim())
      .filter(Boolean);
    const skills = skillTitles.map((title, index) => ({
      title,
      itemsRaw: skillItemsRawValues[index] ?? "",
    }));

    const parsed = aboutSectionFormSchema.safeParse({
      headline: String(formData.get("headline") ?? ""),
      paragraph: String(formData.get("paragraph") ?? ""),
      stats,
      skills,
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted about fields.", parsed.error.flatten().fieldErrors);
    }

    const derivedMetrics = await getDerivedMetrics();
    const finalStats = [{ label: "Years Exp.", value: derivedMetrics.experienceValue }, { label: "Projects", value: derivedMetrics.projectValue }, ...parsed.data.stats];

    await upsertAboutRecord({
      id: ABOUT_ID,
      headline: parsed.data.headline,
      paragraph: parsed.data.paragraph,
      stats: finalStats,
      skills: parsed.data.skills.map((skill) => ({
        title: skill.title,
        items: toCommaList(skill.itemsRaw, 6),
      })),
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/about");
    return successState("About section saved successfully.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save about section.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

export default async function AdminAboutPage() {
  await requireAdmin();

  try {
    const about = await findAboutRecordById(ABOUT_ID);
    const content = normalizeAboutContent(about) ?? defaultAboutContent;
    const derivedMetrics = await getDerivedMetrics();
    const contentWithDerivedStats = {
      ...content,
      stats: applyDerivedStats(content.stats, derivedMetrics),
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">About Section Manager</h1>
          <p className="text-sm text-muted-foreground">Edit teks, stats, dan skill cards yang muncul di About section frontend.</p>
        </div>

        <AboutSectionManager action={saveAboutSectionAction} initialValues={contentWithDerivedStats} derivedMetrics={derivedMetrics} />
      </div>
    );
  } finally {
    await cleanupPrisma();
  }
}
