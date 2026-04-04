import { PrismaClient } from "@prisma/client";

function withConnectionLimit(databaseUrl: string) {
  const url = new URL(databaseUrl);

  if (!url.searchParams.has("connection_limit")) {
    url.searchParams.set("connection_limit", "1");
  }

  if (!url.searchParams.has("pool_timeout")) {
    url.searchParams.set("pool_timeout", "20");
  }

  return url.toString();
}

const datasourceUrl = process.env.DATABASE_URL ? withConnectionLimit(process.env.DATABASE_URL) : undefined;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: datasourceUrl ? { db: { url: datasourceUrl } } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function cleanupPrisma() {
  // No-op in app runtime: this project uses a shared Prisma singleton.
  // Disconnecting per request/action can race with concurrent requests
  // and trigger "Engine is not yet connected".
  return;
}
