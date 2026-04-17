"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { Backlight } from "@/components/ui/backlight";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Particles } from "@/components/ui/particles";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { defaultHeroContent, type HeroSectionContent } from "@/lib/hero-content";

interface HeroSectionProps {
  content?: HeroSectionContent;
  previewAsBanner?: boolean;
}

export function HeroSection({ content = defaultHeroContent, previewAsBanner = false }: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const socialLinks = [
    content.githubUrl ? { icon: Github, href: content.githubUrl, label: "GitHub" } : null,
    content.linkedinUrl ? { icon: Linkedin, href: content.linkedinUrl, label: "LinkedIn" } : null,
    content.twitterUrl ? { icon: Twitter, href: content.twitterUrl, label: "Twitter" } : null,
  ].filter(Boolean) as Array<{ icon: typeof Github; href: string; label: string }>;
  const badgeLabel = content.openToWork ? "Open to work" : "Off the market";
  const eyebrowLabel = content.openToWork ? "Available for work" : "ratrifastudio";
  const sectionClasses = previewAsBanner ? "relative min-h-[440px] flex items-center overflow-hidden" : "relative min-h-screen flex items-center overflow-hidden";
  const contentSpacingClasses = previewAsBanner ? "relative z-10 max-w-6xl mx-auto px-6 py-14 md:py-16 w-full" : "relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 w-full";
  const headlineClasses = previewAsBanner ? "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance text-foreground" : "text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance text-foreground";
  const avatarClasses = previewAsBanner ? "relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden" : "relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden";
  const contentGridClasses = previewAsBanner ? "grid grid-cols-2 gap-8 items-center" : "grid md:grid-cols-2 gap-12 items-center";
  const textColumnClasses = previewAsBanner ? "flex flex-col gap-6" : "order-2 md:order-1 flex flex-col gap-6";
  const avatarColumnClasses = previewAsBanner ? "flex justify-end" : "order-1 md:order-2 flex justify-center md:justify-end";
  const [particleQuantity, setParticleQuantity] = useState(previewAsBanner ? 70 : 100);
  const particleColor = resolvedTheme === "light" ? "#5e17eb" : "#a78bfa";

  useEffect(() => {
    const resolveParticleQuantity = () => {
      const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReducedMotion) {
        setParticleQuantity(previewAsBanner ? 22 : 28);
        return;
      }

      const width = typeof window !== "undefined" ? window.innerWidth : 1280;
      const cores = typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 4) : 4;
      const memory = typeof navigator !== "undefined" && "deviceMemory" in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4) : 4;

      let base = previewAsBanner ? 70 : 100;

      if (width < 640) {
        base = previewAsBanner ? 28 : 36;
      } else if (width < 1024) {
        base = previewAsBanner ? 44 : 62;
      }

      if (cores <= 4 || memory <= 4) {
        base = Math.max(24, Math.floor(base * 0.7));
      }

      if (cores <= 2 || memory <= 2) {
        base = Math.max(18, Math.floor(base * 0.6));
      }

      setParticleQuantity(base);
    };

    resolveParticleQuantity();
    window.addEventListener("resize", resolveParticleQuantity);

    return () => {
      window.removeEventListener("resize", resolveParticleQuantity);
    };
  }, [previewAsBanner]);

  const handleDownloadCv = () => {
    const cvUrl = content.cvUrl;
    if (!cvUrl) {
      return;
    }

    if (cvUrl.startsWith("http")) {
      window.open(cvUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = cvUrl;
    anchor.download = "";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <section id={previewAsBanner ? undefined : "home"} className={sectionClasses}>
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <Particles
        className="absolute inset-0 z-0 h-full w-full text-primary opacity-70 mask-[linear-gradient(to_bottom,white,white_72%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,white,white_72%,transparent)]"
        quantity={particleQuantity}
        staticity={35}
        ease={38}
        size={1.55}
        color={particleColor}
      />
      {/* Radial glow */}
      <Backlight className="absolute z-0 top-1/4 -left-1/4 w-3/4 h-3/4 pointer-events-none" blur={3}>
        <div
          className="w-full h-full rounded-full opacity-[0.12] blur-3xl"
          style={{
            background: "var(--color-primary)",
            maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </Backlight>

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
              <InteractiveHoverButton
                className="h-10 border-border text-foreground hover:bg-secondary"
                aria-label="See my work"
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See My Work
              </InteractiveHoverButton>
              <InteractiveHoverButton className="h-10 border-border text-foreground hover:bg-secondary" aria-label="Download CV" onClick={handleDownloadCv}>
                Download CV
              </InteractiveHoverButton>
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
              <Backlight className="rounded-full" blur={22}>
                <div className={avatarClasses}>
                  <Image src={content.avatarUrl ?? defaultHeroContent.avatarUrl ?? "/images/hero-avatar.jpg"} alt={content.avatarAlt} fill className="object-cover" priority />
                </div>
              </Backlight>

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
