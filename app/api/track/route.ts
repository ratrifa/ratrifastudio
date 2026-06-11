import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const userAgent = req.headers.get("user-agent") ?? "";

    await fetch(`${API_URL}/api/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ip, user_agent: userAgent, path }),
    });
  } catch {
    // Silent fail — never surface tracking errors to the client
  }

  return NextResponse.json({ ok: true });
}
