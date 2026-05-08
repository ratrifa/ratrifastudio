import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { apiErrorResponse, internalServerErrorResponse } from "@/lib/api-error";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/server-auth";
import { deleteLocalUpload } from "@/lib/storage";

interface RouteContext {
  params: Promise<{
    photoId: string;
  }>;
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) {
      return auth.response;
    }

    const { photoId } = await context.params;
    const photo = await prisma.experiencePhoto.findUnique({ where: { id: photoId } });

    if (!photo) {
      return apiErrorResponse({
        code: "NOT_FOUND",
        message: "Experience photo not found",
        status: 404,
      });
    }

    await prisma.experiencePhoto.delete({ where: { id: photoId } });
    await deleteLocalUpload(photo.imageUrl);

    revalidatePath("/");
    revalidatePath("/admin/experiences");

    return NextResponse.json({ message: "Foto dokumentasi berhasil dihapus" });
  } catch {
    return internalServerErrorResponse();
  } finally {
    await cleanupPrisma();
  }
}
