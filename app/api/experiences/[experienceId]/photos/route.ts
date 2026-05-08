import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { apiErrorResponse, internalServerErrorResponse } from "@/lib/api-error";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/server-auth";
import { deleteLocalUploads, saveImageUpload } from "@/lib/storage";

interface RouteContext {
  params: Promise<{
    experienceId: string;
  }>;
}

function extractImageFiles(formData: FormData) {
  const candidates = [...formData.getAll("imageFiles"), ...formData.getAll("imageFile")];
  return candidates.filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const uploadedImagePaths: string[] = [];

  try {
    const auth = await requireAdminApi();
    if (!auth.ok) {
      return auth.response;
    }

    const { experienceId } = await context.params;
    const experience = await prisma.experience.findUnique({ where: { id: experienceId }, select: { id: true } });

    if (!experience) {
      return apiErrorResponse({
        code: "NOT_FOUND",
        message: "Experience not found",
        status: 404,
      });
    }

    const formData = await req.formData();
    const files = extractImageFiles(formData);

    if (files.length === 0) {
      return apiErrorResponse({
        code: "BAD_REQUEST",
        message: "No photo files were provided",
        status: 400,
      });
    }

    const uploaded = await Promise.all(files.map((file) => saveImageUpload(file, "experiences")));
    uploadedImagePaths.push(...uploaded.filter((path): path is string => Boolean(path)));

    const createdPhotos = await prisma.$transaction(async (tx) => {
      const latestPhoto = await tx.experiencePhoto.findFirst({
        where: { experienceId },
        orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
        select: { sortOrder: true },
      });

      const sortOrderStart = (latestPhoto?.sortOrder ?? -1) + 1;

      await tx.experiencePhoto.createMany({
        data: uploadedImagePaths.map((imageUrl, index) => ({
          experienceId,
          imageUrl,
          sortOrder: sortOrderStart + index,
        })),
      });

      return tx.experiencePhoto.findMany({
        where: { experienceId },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    });

    revalidatePath("/");
    revalidatePath("/admin/experiences");

    return NextResponse.json({ photos: createdPhotos }, { status: 201 });
  } catch {
    await deleteLocalUploads(uploadedImagePaths);
    return internalServerErrorResponse();
  } finally {
    await cleanupPrisma();
  }
}
