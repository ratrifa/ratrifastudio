import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { cleanupPrisma, prisma } from "@/lib/prisma";
import { normalizeHeroContent } from "@/lib/hero-content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getSiteIcon() {
  try {
    const heroClient = prisma as typeof prisma & {
      heroSection: {
        findUnique: (args: { where: { id: string } }) => Promise<Parameters<typeof normalizeHeroContent>[0]>;
      };
    };

    const hero = await heroClient.heroSection.findUnique({ where: { id: "home" } });
    const normalized = normalizeHeroContent(hero);
    return normalized.domainLogoUrl ?? normalized.avatarUrl ?? "/images/hero-avatar.jpg";
  } catch {
    return "/images/hero-avatar.jpg";
  } finally {
    await cleanupPrisma();
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const icon = await getSiteIcon();

  return {
    title: "ratrifaStudio",
    description: "a personal web.",
    generator: "ratrifa",
    metadataBase: new URL(siteUrl),
    icons: {
      icon,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
