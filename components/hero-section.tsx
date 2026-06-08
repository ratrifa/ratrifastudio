"use client";

import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
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
  const contentSpacingClasses = previewAsBanner ? "relative z-10 max-w-6xl mx-auto px-6 py-14 md:py-16 w-full" : "relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 w-full";
  const headlineClasses = previewAsBanner ? "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance text-foreground" : "text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance text-foreground";
  const avatarClasses = previewAsBanner ? "relative w-44 h-52 sm:w-52 sm:h-64" : "relative w-56 h-68 sm:w-64 sm:h-78";
  const contentGridClasses = previewAsBanner ? "grid grid-cols-2 gap-8 items-center" : "grid md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-center";
  const textColumnClasses = previewAsBanner ? "flex flex-col gap-6" : "order-2 md:order-1 flex flex-col gap-6";
  const avatarColumnClasses = previewAsBanner ? "flex justify-end" : "order-1 md:order-2 flex justify-center md:justify-end";

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
      <div className={contentSpacingClasses}>
        <div className={contentGridClasses}>
          {/* Left: Text */}
          <div className={textColumnClasses}>
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">{"//"}</span> {eyebrowLabel}
            </p>

            <h1 className={headlineClasses}>{content.headline}</h1>

            <div className="max-w-md space-y-3">
              <p className="text-muted-foreground text-lg leading-relaxed">
                <span className="text-foreground font-semibold">{content.name}</span> — {content.role}
              </p>

              <Separator className="max-w-16" />

              <p className="text-muted-foreground text-lg leading-relaxed">{content.description}</p>
            </div>

            {/* Tech tags */}
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-xs text-muted-foreground" aria-label="Tech skills">
              {content.techTags.map((tag, index) => (
                <span key={tag} className="flex items-center gap-2.5">
                  {index > 0 && <span className="text-border" aria-hidden="true">·</span>}
                  {tag}
                </span>
              ))}
            </p>

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

          {/* Right: Portrait, framed like a code preview pane */}
          <div className={avatarColumnClasses}>
            <figure className="relative">
              <div className={`${avatarClasses} overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-black/5`}>
                <ImageWithFallback src={content.avatarUrl ?? defaultHeroContent.avatarUrl ?? "/images/hero-avatar.jpg"} alt={content.avatarAlt} fill className="object-cover grayscale-[35%] contrast-[1.05]" priority />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                <span className="truncate">{"// "}{content.statusBadgeDetail}</span>
                <span className="flex items-center gap-1.5 text-foreground shrink-0">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${content.openToWork ? "bg-green-400 animate-pulse" : "bg-muted-foreground"}`} />
                  {badgeLabel}
                </span>
              </figcaption>
            </figure>
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
