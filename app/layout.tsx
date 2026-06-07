import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { apiGet } from "@/lib/api-server";
import type { HeroSectionContent } from "@/lib/hero-content";
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
  const hero = await apiGet<HeroSectionContent>("/api/hero");
  return hero?.domainLogoUrl ?? hero?.avatarUrl ?? "/images/hero-avatar.jpg";
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
