"use client";

import Image from "next/image";
import { ArrowDown, Download, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { defaultHeroContent, type HeroSectionContent } from "@/lib/hero-content";

interface HeroSectionProps {
  content?: HeroSectionContent;
  previewAsBanner?: boolean;
}

export function HeroSection({ content = defaultHeroContent, previewAsBanner = false }: HeroSectionProps) {
  const socialLinks = [
    content.githubUrl ? { icon: Github, href: content.githubUrl, label: "GitHub" } : null,
    content.linkedinUrl ? { icon: Linkedin, href: content.linkedinUrl, label: "LinkedIn" } : null,
    content.twitterUrl ? { icon: Twitter, href: content.twitterUrl, label: "Twitter" } : null,
  ].filter(Boolean) as Array<{ icon: typeof Github; href: string; label: string }>;
  const badgeLabel = content.openToWork ? "Open to work" : "Off the market";
  const eyebrowLabel = content.openToWork ? "Available for work" : "ratrifastudio";
  const sectionClasses = previewAsBanner ? "relative min-h-[440px] flex items-center overflow-hidden" : "relative min-h-screen flex items-center overflow-hidden";
  const contentSpacingClasses = previewAsBanner ? "relative max-w-6xl mx-auto px-6 py-14 md:py-16 w-full" : "relative max-w-6xl mx-auto px-6 py-24 md:py-32 w-full";
  const headlineClasses = previewAsBanner ? "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance text-foreground" : "text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance text-foreground";
  const avatarClasses = previewAsBanner
    ? "relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10"
    : "relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10";
  const contentGridClasses = previewAsBanner ? "grid grid-cols-2 gap-8 items-center" : "grid md:grid-cols-2 gap-12 items-center";
  const textColumnClasses = previewAsBanner ? "flex flex-col gap-6" : "order-2 md:order-1 flex flex-col gap-6";
  const avatarColumnClasses = previewAsBanner ? "flex justify-end" : "order-1 md:order-2 flex justify-center md:justify-end";

  return (
    <section id={previewAsBanner ? undefined : "home"} className={sectionClasses}>
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      {/* Radial glow */}
      <div className="absolute top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full opacity-10 blur-3xl" style={{ background: "var(--color-primary)" }} aria-hidden="true" />

      <div className={contentSpacingClasses}>
        <div className={contentGridClasses}>
          {/* Left: Text */}
          <div className={textColumnClasses}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-primary font-mono text-sm tracking-widest uppercase">{eyebrowLabel}</span>
            </div>

            <h1 className={headlineClasses}>{content.headline}</h1>

            <div className="max-w-md space-y-2">
              <p className="text-muted-foreground text-lg leading-relaxed">
                <span className="text-foreground font-semibold">{content.name}</span> — {content.role}
              </p>

              <Separator />

              <p className="text-muted-foreground text-lg leading-relaxed">{content.description}</p>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2" aria-label="Tech skills">
              {content.techTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono border border-border">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See My Work
                <ArrowDown size={16} />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-2" asChild>
                <a
                  href={content.cvUrl}
                  download={content.cvUrl.startsWith("/") ? "" : undefined}
                  target={content.cvUrl.startsWith("http") ? "_blank" : undefined}
                  rel={content.cvUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label="Download CV"
                >
                  <Download size={16} />
                  Download CV
                </a>
              </Button>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs text-muted-foreground font-mono">Find me on</span>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Avatar */}
          <div className={avatarColumnClasses}>
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full scale-105 opacity-20 blur-md" style={{ background: "var(--color-primary)" }} aria-hidden="true" />
              <div className={avatarClasses}>
                <Image src={content.avatarUrl ?? defaultHeroContent.avatarUrl ?? "/images/hero-avatar.jpg"} alt={content.avatarAlt} fill className="object-cover" priority />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl px-4 py-2 shadow-lg">
                <p className="font-mono text-xs text-muted-foreground">{content.statusBadgeDetail}</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${content.openToWork ? "bg-green-400 animate-pulse" : "bg-muted-foreground"}`} />
                  {badgeLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!previewAsBanner ? (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-xs font-mono">scroll</span>
          <ArrowDown size={14} />
        </div>
      ) : null}
    </section>
  );
}
