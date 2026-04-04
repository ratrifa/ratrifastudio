import { NextRequest, NextResponse } from "next/server";

import { cleanupPrisma, prisma } from "@/lib/prisma";
import { experienceFormSchema } from "@/lib/validation";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { periodStart: "asc" },
    });

    return NextResponse.json(experiences);
  } finally {
    await cleanupPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = experienceFormSchema.safeParse({
      title: body?.title,
      company: body?.company,
      periodStart: body?.periodStart,
      periodEnd: body?.periodEnd || "",
      description: body?.description,
    });

    if (!parsed.success) {
      return NextResponse.json({ message: "Payload tidak valid", errors: parsed.error.errors }, { status: 400 });
    }

    const { title, company, periodStart, periodEnd, description } = parsed.data;

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        periodStart: new Date(periodStart),
        periodEnd: periodEnd ? new Date(periodEnd) : null,
        description,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } finally {
    await cleanupPrisma();
  }
}
