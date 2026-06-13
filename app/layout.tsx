import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { apiGet } from "@/lib/api-server";
import type { HeroSectionContent } from "@/lib/hero-content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getSiteIcon() {
  const hero = await apiGet<HeroSectionContent>("/api/hero");
  return hero?.domainLogoUrl ?? hero?.avatarUrl ?? "/images/hero-avatar.jpg";
}

export async function generateMetadata(): Promise<Metadata> {
  const icon = await getSiteIcon();
  const isDev = process.env.NODE_ENV === "development";

  return {
    title: isDev ? "ratrifaStudio [dev]" : "ratrifaStudio",
    description: "a personal web.",
    generator: "ratrifa",
    metadataBase: new URL(siteUrl),
    icons: {
      icon: isDev
        ? "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>"
        : icon,
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable} ${instrumentSerif.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
