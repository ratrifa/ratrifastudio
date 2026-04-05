import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
}

export function getSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}

export async function createAdminSession(userId: string) {
  const sessionId = randomUUID();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    // Enforce a single active session per user.
    await tx.adminSession.updateMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        revokedAt: now,
      },
    });

    await tx.adminSession.create({
      data: {
        id: sessionId,
        userId,
        expiresAt: sessionExpiryDate(),
        lastSeenAt: now,
      },
    });
  });

  return sessionId;
}

export async function isAdminSessionActive(sessionId: string) {
  if (!sessionId) {
    return false;
  }

  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (!session) {
    return false;
  }

  if (session.revokedAt) {
    return false;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    return false;
  }

  return true;
}

export async function touchAdminSession(sessionId: string) {
  await prisma.adminSession
    .update({
      where: { id: sessionId },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => {
      return;
    });
}

export async function revokeAdminSession(sessionId: string) {
  await prisma.adminSession
    .update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    })
    .catch(() => {
      return;
    });
}
