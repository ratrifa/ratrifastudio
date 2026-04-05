import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
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

export const metadata: Metadata = {
  title: "ratrifaStudio",
  description: "a personal web.",
  generator: "ratrifa",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/uploads/hero/1775315805088-008a652f-ce9b-47d2-bc29-9d103ad0fa51.png",
  },
};

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
