import bcrypt from "bcryptjs";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { FormSubmitButton } from "@/components/admin/form-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_COOKIE_NAME, createAdminToken } from "@/lib/auth";
import { createAdminSession, getSessionTtlSeconds } from "@/lib/admin-session";
import { clearLoginFailures, isLoginLocked, recordLoginFailure } from "@/lib/login-security";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/server-auth";
import { loginInputSchema } from "@/lib/validation";

async function loginAction(formData: FormData) {
  "use server";

  const databaseErrorRedirect = () => {
    redirect("/backdoor-entry?error=Database+belum+bisa+diakses");
  };

  try {
    const parsed = loginInputSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!parsed.success) {
      redirect("/backdoor-entry?error=Email+dan+password+wajib+diisi");
    }

    const { email, password } = parsed.data;

    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for") ?? "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "local";
    const lockKey = `${email}|${clientIp}`;

    const lockState = await isLoginLocked(lockKey);
    if (lockState.locked) {
      redirect("/backdoor-entry?error=Terlalu+banyak+percobaan.+Coba+lagi+beberapa+menit+lagi");
    }

    let user: { id: string; email: string; password: string; role: "ADMIN" } | null = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        },
      });
    } catch {
      databaseErrorRedirect();
    }

    if (!user) {
      await recordLoginFailure(lockKey);
      redirect("/backdoor-entry?error=Kredensial+tidak+valid");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid || user.role !== "ADMIN") {
      await recordLoginFailure(lockKey);
      redirect("/backdoor-entry?error=Kredensial+tidak+valid");
    }

    await clearLoginFailures(lockKey);
    let sessionId = "";
    try {
      sessionId = await createAdminSession(user.id);
    } catch {
      databaseErrorRedirect();
    }

    if (!sessionId) {
      databaseErrorRedirect();
    }

    const token = await createAdminToken({
      sub: user.id,
      email: user.email,
      role: "ADMIN",
      sid: sessionId,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionTtlSeconds(),
    });

    redirect("/admin");
  } finally {
    await cleanupPrisma();
  }
}

export default async function BackdoorEntryPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Masuk ke dashboard CMS internal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {params.error ? <p className="text-sm text-red-400">{params.error}</p> : null}

            <FormSubmitButton pendingLabel="Signing in..." className="w-full">
              Sign In
            </FormSubmitButton>
            <Button type="button" variant="ghost" className="w-full" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
