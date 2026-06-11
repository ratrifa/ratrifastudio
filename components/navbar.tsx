"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, Code2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { defaultHeroContent } from "@/lib/hero-content";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Project", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certificate", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  domainLabel?: string;
  domainLogoUrl?: string | null;
}

export function Navbar({ domainLabel = defaultHeroContent.domainLabel, domainLogoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateNavState = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));

      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      let nextActive = sections[0] ?? "home";

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          nextActive = sections[i];
          break;
        }
      }

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavState);
        ticking = true;
      }
    };

    updateNavState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const brandLabel = domainLabel.trim() || defaultHeroContent.domainLabel;
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

  const brandLogo = domainLogoUrl ? (
    <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-transparent">
      <ImageWithFallback src={domainLogoUrl} alt={`${brandLabel} logo`} fill className="object-contain p-1" sizes="32px" />
    </span>
  ) : (
    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <Code2 size={16} />
    </span>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "flex items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-300",
          scrolled ? "border-border bg-background/75 shadow-lg shadow-black/5 backdrop-blur-md" : "border-transparent bg-transparent"
        )}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="flex cursor-pointer items-center gap-2 pl-1 pr-2"
          aria-label="Go to home"
        >
          {brandLogo}
          <span className="font-mono text-sm font-semibold leading-none tracking-tight text-foreground">{renderBrandLabel()}</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center md:flex" role="list">
          {NAV_LINKS.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={cn(
                    "relative block cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-secondary" />}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-border md:block" />

        <div className="hidden items-center md:flex">
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-foreground md:hidden" aria-label="Open mobile menu">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col border-border bg-background px-6 pt-12">
            <div className="flex items-center gap-2">
              {brandLogo}
              <span className="font-mono text-sm font-semibold leading-none tracking-tight">{renderBrandLabel()}</span>
            </div>

            <ul className="mt-10 flex flex-1 flex-col gap-2" role="list">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className={cn(
                        "cursor-pointer font-display text-2xl font-semibold tracking-tight transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mb-6 border-t border-border pt-6">
              <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
