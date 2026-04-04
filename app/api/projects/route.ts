import { NextRequest, NextResponse } from "next/server";

import { cleanupPrisma, prisma } from "@/lib/prisma";
import { projectFormSchema, toTechStack } from "@/lib/validation";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } finally {
    await cleanupPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = projectFormSchema.safeParse({
      title: body?.title,
      description: body?.description,
      link: body?.link ?? "",
      githubUrl: body?.githubUrl ?? "",
      techStackRaw: Array.isArray(body?.techStack) ? body.techStack.join(",") : String(body?.techStackRaw ?? ""),
      isPublished: Boolean(body?.isPublished),
    });

    if (!parsed.success) {
      return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 });
    }

    const { title, description, link, githubUrl, techStackRaw, isPublished } = parsed.data;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        link,
        githubUrl,
        techStack: toTechStack(techStackRaw),
        isPublished,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } finally {
    await cleanupPrisma();
  }
}
