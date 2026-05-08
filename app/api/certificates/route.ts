import { NextRequest, NextResponse } from "next/server";

import { internalServerErrorResponse, validationErrorResponse } from "@/lib/api-error";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/server-auth";
import { certificateFormSchema } from "@/lib/validation";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ featured: "desc" }, { issueDate: "desc" }],
    });

    return NextResponse.json(certificates);
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
    const parsed = certificateFormSchema.safeParse({
      title: body?.title,
      issuer: body?.issuer,
      issueDate: body?.issueDate,
      imageUrl: body?.imageUrl || "",
      credentialUrl: body?.credentialUrl || "",
      featured: Boolean(body?.featured),
    });

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten());
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
  } catch {
    return internalServerErrorResponse();
  } finally {
    await cleanupPrisma();
  }
}
