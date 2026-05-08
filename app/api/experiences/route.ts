import { NextRequest, NextResponse } from "next/server";

import { internalServerErrorResponse, validationErrorResponse } from "@/lib/api-error";
import { toDbExperienceType } from "@/lib/experience-types";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/server-auth";
import { experienceFormSchema } from "@/lib/validation";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        photos: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
      orderBy: { periodStart: "asc" },
    });

    return NextResponse.json(experiences);
  } catch {
    return internalServerErrorResponse();
  } finally {
    await cleanupPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) {
      return auth.response;
    }

    const body = await req.json();
    const imageUrls = Array.isArray(body?.imageUrls) ? body.imageUrls.filter((value: unknown): value is string => typeof value === "string") : [];
    const parsed = experienceFormSchema.safeParse({
      title: body?.title,
      company: body?.company,
      experienceType: body?.experienceType,
      periodStart: body?.periodStart,
      periodEnd: body?.periodEnd || "",
      description: body?.description,
    });

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten());
    }

    const { title, company, experienceType, periodStart, periodEnd, description } = parsed.data;

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        experienceType: toDbExperienceType(experienceType),
        periodStart: new Date(periodStart),
        periodEnd: periodEnd ? new Date(periodEnd) : null,
        description,
        photos:
          imageUrls.length > 0
            ? {
                create: imageUrls.map((imageUrl, index) => ({
                  imageUrl,
                  sortOrder: index,
                })),
              }
            : undefined,
      },
      include: {
        photos: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch {
    return internalServerErrorResponse();
  } finally {
    await cleanupPrisma();
  }
}
