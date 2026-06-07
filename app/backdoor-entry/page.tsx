import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentAdmin } from "@/lib/server-auth";

export default async function BackdoorEntryPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Masuk ke dashboard CMS internal.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
