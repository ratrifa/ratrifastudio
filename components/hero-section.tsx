"use client";

import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Reveal } from "@/components/ui/reveal";
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

  // Wordmark raksasa: pecah domainLabel di titik terakhir → "ratrifa" + ".studio"
  const brandLabel = content.domainLabel?.trim() || defaultHeroContent.domainLabel;
  const dotIndex = brandLabel.lastIndexOf(".");
  const hasTld = dotIndex > 0 && dotIndex < brandLabel.length - 1;
  const wordmarkMain = hasTld ? brandLabel.slice(0, dotIndex) : brandLabel;
  const wordmarkTld = hasTld ? brandLabel.slice(dotIndex) : null;

  const sectionClasses = previewAsBanner
    ? "relative min-h-[440px] flex items-center overflow-hidden"
    : "relative min-h-screen flex items-center overflow-hidden";
  const containerClasses = previewAsBanner
    ? "relative z-10 mx-auto w-full max-w-6xl px-6 py-12"
    : "relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 pb-24 sm:pt-28";
  const wordmarkMainClasses = previewAsBanner
    ? "block font-display font-semibold tracking-[-0.04em] leading-[0.85] text-foreground text-[clamp(2.25rem,6vw,3.75rem)]"
    : "block font-display font-semibold tracking-[-0.04em] leading-[0.85] text-foreground text-[clamp(4rem,15vw,11.5rem)]";
  const wordmarkTldClasses = previewAsBanner
    ? "-mt-[0.35em] ml-[34%] block w-fit font-serif italic font-normal leading-none text-primary text-[clamp(1.25rem,3vw,2rem)]"
    : "-mt-[0.4em] ml-[34%] block w-fit font-serif italic font-normal leading-none text-primary text-[clamp(2.25rem,8vw,6.25rem)]";

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
      {/* Background */}
      {!previewAsBanner && <div aria-hidden className="absolute inset-0 bg-grid-fade" />}
      <div aria-hidden className="pointer-events-none absolute -top-32 right-[-10%] size-[34rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className={containerClasses}>
        {/* Row 1 — tagline editorial kiri + portrait duotone kanan */}
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className={previewAsBanner ? "flex flex-col gap-4 lg:col-span-5" : "flex flex-col gap-6 lg:col-span-5 lg:pt-6"}>
            {/* Status — square marker ala editorial */}
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span aria-hidden className="size-2.5 bg-primary" />
              {badgeLabel}
            </p>

            {/* Tagline uppercase (headline CMS) */}
            <p className="max-w-sm text-base font-semibold uppercase leading-relaxed tracking-[0.06em] text-balance text-foreground sm:text-lg">
              {content.headline}
            </p>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">{content.description}</p>

            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-foreground">{content.name}</span> — {content.role}
            </p>

            {/* Tech tags as chips — only in admin banner preview (marquee handles them otherwise) */}
            {previewAsBanner && (
              <p className="flex flex-wrap gap-2" aria-label="Tech skills">
                {content.techTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </Reveal>

          {/* Portrait dengan duotone violet — warna asli muncul saat hover */}
          <Reveal delay={0.1} className="flex justify-center lg:col-span-7 lg:justify-end">
            <figure className={previewAsBanner ? "w-full max-w-[220px]" : "w-full max-w-sm lg:max-w-[340px]"}>
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border">
                <ImageWithFallback
                  src={content.avatarUrl ?? defaultHeroContent.avatarUrl ?? "/images/hero-avatar.jpg"}
                  alt={content.avatarAlt}
                  fill
                  className="object-cover img-hover-zoom"
                  priority
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                <span className="truncate uppercase tracking-wider">[{content.statusBadgeDetail}]</span>
                <span className="flex shrink-0 items-center gap-1.5 text-foreground">
                  <span aria-hidden className={`size-1.5 rounded-full ${content.openToWork ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} />
                  {badgeLabel}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Row 2 — wordmark raksasa + CTA; di desktop ditarik naik bersisian dengan bawah foto */}
        <div className={previewAsBanner ? "mt-8 grid items-end gap-6 lg:grid-cols-12 lg:gap-16" : "mt-12 grid items-end gap-8 lg:-mt-24 lg:grid-cols-12 lg:gap-16"}>
          <Reveal delay={0.15} className="min-w-0 lg:col-span-8">
            <h1 className="w-fit max-w-full">
              <span className={wordmarkMainClasses}>{wordmarkMain}</span>
              {wordmarkTld && <span className={wordmarkTldClasses}>{wordmarkTld}</span>}
            </h1>
          </Reveal>

          <Reveal delay={0.2} className="flex flex-col gap-5 lg:col-span-4 lg:items-end lg:pb-3">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                aria-label="See my work"
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:opacity-90"
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See my work
                <ArrowDown className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Download CV"
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-transparent px-6 text-sm font-medium text-foreground transition-all hover:gap-3 hover:bg-secondary"
                onClick={handleDownloadCv}
              >
                Download CV
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">Find me on</span>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed spec strip — tech stack sebagai data sheet ber-index */}
      {!previewAsBanner && (
        <div className="absolute bottom-0 inset-x-0 border-t border-border bg-background/60 backdrop-blur" aria-label="Tech skills">
          <ul className="flex items-stretch overflow-x-auto px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" role="list">
            <li className="flex shrink-0 items-center gap-2.5 py-3 pr-5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
              <span aria-hidden className="size-1.5 bg-primary" />
              Stack
            </li>
            {content.techTags.map((tag, index) => (
              <li
                key={tag}
                className="flex flex-1 shrink-0 items-baseline gap-2 whitespace-nowrap border-l border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                <span className="text-primary" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
