"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Code2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { Spinner } from "@/components/ui/spinner";
import { defaultHeroContent } from "@/lib/hero-content";
import { useState } from "react";
import { ContactSection } from "@/components/contact-section";

const CONTACT_EMAIL = "satriafebriandanu@gmail.com";

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
  const domainLogoUrl = brand?.domainLogoUrl ?? defaultHeroContent.domainLogoUrl;

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
    <>
      <ContactSection social={social} />
      <footer className="bg-card border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#home");
                }}
                className="flex items-center gap-2"
                aria-label="Go to home"
              >
                {domainLogoUrl ? (
                  <span className="relative flex items-center justify-center w-8 h-8 rounded-md overflow-hidden bg-transparent">
                    <Image src={domainLogoUrl} alt={`${brandLabel} logo`} fill className="object-contain p-1" sizes="32px" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                    <Code2 size={16} />
                  </span>
                )}
                <span className="font-mono font-semibold text-sm text-foreground">{renderBrandLabel()}</span>
              </a>
              <p className="text-xs text-muted-foreground leading-relaxed">Building modern web experiences with passion and precision.</p>
            </div>

            {/* Quick links */}
            <nav aria-label="Footer navigation" className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">Quick Links</p>
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">Social</p>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Icon size={13} />
                  {label}
                </a>
              ))}
            </div>

            {/* Contact short */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">Get In Touch</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Mail size={11} />
                {CONTACT_EMAIL}
              </a>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin size={11} />
                Bandung, Indonesia
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ratrifa. All rights reserved.</p>
            <p className="text-xs text-muted-foreground font-mono">Built with React &amp; Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </>
  );
}
