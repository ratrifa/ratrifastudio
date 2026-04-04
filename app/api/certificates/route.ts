import { NextRequest, NextResponse } from "next/server";

import { cleanupPrisma, prisma } from "@/lib/prisma";
import { certificateFormSchema } from "@/lib/validation";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ featured: "desc" }, { issueDate: "desc" }],
    });

    return NextResponse.json(certificates);
  } finally {
    await cleanupPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = certificateFormSchema.safeParse({
      title: body?.title,
      issuer: body?.issuer,
      issueDate: body?.issueDate,
      imageUrl: body?.imageUrl || "",
      credentialUrl: body?.credentialUrl || "",
      featured: Boolean(body?.featured),
    });

    if (!parsed.success) {
      return NextResponse.json({ message: "Payload tidak valid", errors: parsed.error.errors }, { status: 400 });
    }

    const { title, issuer, issueDate, imageUrl, credentialUrl, featured } = parsed.data;

    if (featured) {
      await prisma.certificate.updateMany({ data: { featured: false } });
    }

    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate: new Date(issueDate),
        imageUrl: imageUrl || null,
        credentialUrl: credentialUrl || null,
        featured,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } finally {
    await cleanupPrisma();
  }
}
