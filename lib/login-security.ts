import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

function lockUntilDate() {
  return new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
}

export async function isLoginLocked(key: string) {
  const row = await prisma.adminLoginAttempt.findUnique({ where: { key } }).catch(() => null);
  if (!row?.lockedUntil) {
    return { locked: false as const, secondsRemaining: 0 };
  }

  const remaining = row.lockedUntil.getTime() - Date.now();
  if (remaining <= 0) {
    await prisma.adminLoginAttempt
      .update({
        where: { key },
        data: { failedCount: 0, lockedUntil: null },
      })
      .catch(() => {
        return;
      });
    return { locked: false as const, secondsRemaining: 0 };
  }

  return { locked: true as const, secondsRemaining: Math.ceil(remaining / 1000) };
}

export async function recordLoginFailure(key: string) {
  const current = await prisma.adminLoginAttempt.findUnique({ where: { key } }).catch(() => null);
  const nextCount = (current?.failedCount ?? 0) + 1;
  const shouldLock = nextCount >= MAX_FAILED_ATTEMPTS;

  await prisma.adminLoginAttempt
    .upsert({
      where: { key },
      update: {
        failedCount: shouldLock ? 0 : nextCount,
        lockedUntil: shouldLock ? lockUntilDate() : null,
        lastFailedAt: new Date(),
      },
      create: {
        key,
        failedCount: shouldLock ? 0 : nextCount,
        lockedUntil: shouldLock ? lockUntilDate() : null,
        lastFailedAt: new Date(),
      },
    })
    .catch(() => {
      return;
    });

  return { locked: shouldLock };
}

export async function clearLoginFailures(key: string) {
  await prisma.adminLoginAttempt.delete({ where: { key } }).catch(() => {
    return;
  });
}
