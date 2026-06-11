"use client";

import { Github, Linkedin, Twitter, ArrowUp } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { defaultHeroContent } from "@/lib/hero-content";

const buildSocialLinks = (social?: { githubUrl?: string | null; linkedinUrl?: string | null; twitterUrl?: string | null }) => {
  const source = social ?? defaultHeroContent;

  return [
    source.githubUrl ? { icon: Github, href: source.githubUrl, label: "GitHub" } : null,
    source.linkedinUrl ? { icon: Linkedin, href: source.linkedinUrl, label: "LinkedIn" } : null,
    source.twitterUrl ? { icon: Twitter, href: source.twitterUrl, label: "Twitter" } : null,
  ].filter(Boolean) as Array<{ icon: typeof Github; href: string; label: string }>;
};

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

interface FooterSocialProps {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
}

interface FooterBrandProps {
  domainLabel?: string;
  domainLogoUrl?: string | null;
}

// ContactSection extracted to components/contact-section.tsx

export function Footer({ social, brand }: { social?: FooterSocialProps; brand?: FooterBrandProps }) {
  const socialLinks = buildSocialLinks(social);
  const brandLabel = brand?.domainLabel?.trim() || defaultHeroContent.domainLabel;

  const renderBrandLabel = () => {
    const dotIndex = brandLabel.lastIndexOf(".");
    if (dotIndex > 0 && dotIndex < brandLabel.length - 1) {
      return (
        <>
          {brandLabel.slice(0, dotIndex)}
          <span className="text-primary">{brandLabel.slice(dotIndex)}</span>
        </>
      );
    }

    return brandLabel;
  };

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        {/* Blok 1 — wordmark raksasa */}
        <Reveal>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#home");
            }}
            aria-label="Go to home"
            className="block w-fit font-display font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(2.75rem,11vw,8.5rem)] text-foreground select-none"
          >
            {renderBrandLabel()}
          </a>
        </Reveal>

        {/* Blok 2 — quick links + social */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Blok 3 — legal */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ratrifa &mdash; Bandung, Indonesia</p>
          <div className="flex items-center gap-4">
            <p className="font-mono text-xs text-muted-foreground">Built with Next.js &amp; Tailwind</p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
