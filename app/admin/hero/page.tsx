import { HeroSectionManager } from "@/components/admin/hero-section-manager";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { defaultHeroContent, normalizeHeroContent } from "@/lib/hero-content";
import { heroSectionFormSchema, toTagList } from "@/lib/validation";
import { saveImageUpload, deleteLocalUpload, saveDocumentUpload } from "@/lib/storage";
import type { FormState } from "@/lib/form-state";
import { revalidatePath } from "next/cache";

const HERO_ID = "home";
type HeroRecord = {
  id: string;
  headline: string | null;
  description: string | null;
  domainLogoUrl: string | null;
  domainLabel: string | null;
  name: string | null;
  role: string | null;
  techTags: unknown;
  cvUrl: string | null;
  avatarUrl: string | null;
  avatarAlt: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  statusBadgeDetail: string | null;
  openToWork: boolean | null;
};

function isConnectionLimitError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("max_user_connections") || message.includes("resource (current value: 5)");
}

const CONNECTION_LIMIT_MESSAGE = "Koneksi database sedang penuh (max_user_connections). Tutup server/proses ganda lalu coba lagi beberapa detik.";

async function findHeroRecordById(id: string): Promise<HeroRecord | null> {
  try {
    const rows = await prisma.$queryRaw<HeroRecord[]>`
      SELECT
        id,
        headline,
        description,
        domainLogoUrl,
        domainLabel,
        name,
        role,
        techTags,
        cvUrl,
        avatarUrl,
        avatarAlt,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        statusBadgeDetail,
        openToWork
      FROM HeroSection
      WHERE id = ${id}
      LIMIT 1
    `;

    return rows[0] ?? null;
  } catch (error) {
    if (isConnectionLimitError(error)) {
      return null;
    }
    throw error;
  }
}

async function upsertHeroRecord(args: {
  id: string;
  headline: string;
  description: string;
  domainLogoUrl: string | null;
  domainLabel: string;
  name: string;
  role: string;
  techTags: string[];
  cvUrl: string;
  avatarUrl: string | null;
  avatarAlt: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  statusBadgeDetail: string;
  openToWork: boolean;
}) {
  const techTagsJson = JSON.stringify(args.techTags);

  await prisma.$executeRaw`
    INSERT INTO HeroSection (
      id,
      headline,
      description,
      domainLogoUrl,
      domainLabel,
      name,
      role,
      techTags,
      cvUrl,
      avatarUrl,
      avatarAlt,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      statusBadgeDetail,
      openToWork,
      createdAt,
      updatedAt
    )
    VALUES (
      ${args.id},
      ${args.headline},
      ${args.description},
      ${args.domainLogoUrl},
      ${args.domainLabel},
      ${args.name},
      ${args.role},
      ${techTagsJson},
      ${args.cvUrl},
      ${args.avatarUrl},
      ${args.avatarAlt},
      ${args.githubUrl},
      ${args.linkedinUrl},
      ${args.twitterUrl},
      ${args.statusBadgeDetail},
      ${args.openToWork},
      NOW(),
      NOW()
    )
    ON DUPLICATE KEY UPDATE
      headline = VALUES(headline),
      description = VALUES(description),
      domainLogoUrl = VALUES(domainLogoUrl),
      domainLabel = VALUES(domainLabel),
      name = VALUES(name),
      role = VALUES(role),
      techTags = VALUES(techTags),
      cvUrl = VALUES(cvUrl),
      avatarUrl = VALUES(avatarUrl),
      avatarAlt = VALUES(avatarAlt),
      githubUrl = VALUES(githubUrl),
      linkedinUrl = VALUES(linkedinUrl),
      twitterUrl = VALUES(twitterUrl),
      statusBadgeDetail = VALUES(statusBadgeDetail),
      openToWork = VALUES(openToWork),
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

async function saveHeroSectionAction(_state: FormState, formData: FormData): Promise<FormState> {
  "use server";

  try {
    await requireAdmin();

    const parsed = heroSectionFormSchema.safeParse({
      headline: String(formData.get("headline") ?? ""),
      description: String(formData.get("description") ?? ""),
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      domainLabel: String(formData.get("domainLabel") ?? ""),
      techTagsRaw: String(formData.get("techTagsRaw") ?? ""),
      avatarAlt: String(formData.get("avatarAlt") ?? ""),
      githubUrl: String(formData.get("githubUrl") ?? ""),
      linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
      twitterUrl: String(formData.get("twitterUrl") ?? ""),
      statusBadgeDetail: String(formData.get("statusBadgeDetail") ?? ""),
      openToWork: formData.get("openToWork") === "true",
    });

    if (!parsed.success) {
      return errorState("Please fix the highlighted hero fields.", parsed.error.flatten().fieldErrors);
    }

    const uploadedAvatar = await saveImageUpload(formData.get("avatarFile"), "hero");
    const uploadedDomainLogo = await saveImageUpload(formData.get("domainLogoFile"), "hero");
    const uploadedCv = await saveDocumentUpload(formData.get("cvFile"), "hero");
    const current = await findHeroRecordById(HERO_ID);
    const avatarUrl = uploadedAvatar ?? current?.avatarUrl ?? defaultHeroContent.avatarUrl ?? null;
    const domainLogoUrl = uploadedDomainLogo ?? current?.domainLogoUrl ?? defaultHeroContent.domainLogoUrl ?? null;
    const cvUrl = uploadedCv ?? current?.cvUrl ?? defaultHeroContent.cvUrl ?? "";

    if (uploadedAvatar && current?.avatarUrl && current.avatarUrl !== uploadedAvatar) {
      await deleteLocalUpload(current.avatarUrl);
    }
    if (uploadedDomainLogo && current?.domainLogoUrl && current.domainLogoUrl !== uploadedDomainLogo) {
      await deleteLocalUpload(current.domainLogoUrl);
    }
    if (uploadedCv && current?.cvUrl && current.cvUrl !== uploadedCv) {
      await deleteLocalUpload(current.cvUrl);
    }

    await upsertHeroRecord({
      id: HERO_ID,
      headline: parsed.data.headline,
      description: parsed.data.description,
      domainLogoUrl,
      domainLabel: parsed.data.domainLabel,
      name: parsed.data.name,
      role: parsed.data.role,
      techTags: toTagList(parsed.data.techTagsRaw),
      cvUrl,
      avatarUrl,
      avatarAlt: parsed.data.avatarAlt,
      githubUrl: parsed.data.githubUrl ?? "",
      linkedinUrl: parsed.data.linkedinUrl ?? "",
      twitterUrl: parsed.data.twitterUrl ?? "",
      statusBadgeDetail: parsed.data.statusBadgeDetail,
      openToWork: parsed.data.openToWork,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/hero");
    return successState("Hero section saved successfully.");
  } catch (error) {
    const message = isConnectionLimitError(error) ? CONNECTION_LIMIT_MESSAGE : error instanceof Error ? error.message : "Failed to save hero section.";
    return errorState(message);
  } finally {
    await cleanupPrisma();
  }
}

export default async function AdminHeroPage() {
  await requireAdmin();

  try {
    const hero = await findHeroRecordById(HERO_ID);
    const content = normalizeHeroContent(hero);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hero Section Manager</h1>
          <p className="text-sm text-muted-foreground">Edit teks, avatar, CTA, dan social link yang muncul di hero frontend.</p>
        </div>

        <HeroSectionManager action={saveHeroSectionAction} initialValues={content} />
      </div>
    );
  } finally {
    await cleanupPrisma();
  }
}
