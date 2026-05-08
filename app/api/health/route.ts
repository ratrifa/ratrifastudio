import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "connected" });
  } catch {
    return apiErrorResponse({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database disconnected",
      status: 500,
      details: { ok: false, database: "disconnected" },
    });
  }
}
