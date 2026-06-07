"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api";

/**
 * Login form that authenticates against the Laravel API directly. On success
 * the browser stores the `rf_admin_token` cookie (set by the API with
 * credentials), and a full navigation to /admin lets the server-side guard
 * pick it up.
 */
export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        }),
      });

      if (res.ok) {
        // Full reload so the server component reads the freshly set cookie.
        window.location.assign("/admin");
        return;
      }

      if (res.status === 429) {
        setError("Terlalu banyak percobaan. Coba lagi beberapa menit lagi.");
      } else if (res.status === 422) {
        setError("Email dan password wajib diisi.");
      } else {
        setError("Kredensial tidak valid.");
      }
    } catch {
      setError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <Button type="button" variant="ghost" className="w-full" asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </form>
  );
}
