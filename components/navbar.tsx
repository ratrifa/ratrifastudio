"use client";

import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
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
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
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

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent")}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4" aria-label="Main navigation">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="flex items-center gap-2 group"
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
          <span className="font-mono font-semibold text-foreground text-sm tracking-tight">{renderBrandLabel()}</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
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
                  className={cn("relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && <span className="absolute bottom-0.5 left-3 right-3 h-px bg-primary rounded-full" />}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleNavClick("#contact")}>
            Hire Me
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground" aria-label="Open mobile menu">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card border-border w-72 flex flex-col pt-14">
            <SheetClose className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
              <span className="sr-only">Close</span>
            </SheetClose>

            <div className="flex items-center gap-2 mb-8">
              {domainLogoUrl ? (
                <span className="relative flex items-center justify-center w-8 h-8 rounded-md overflow-hidden bg-transparent">
                  <Image src={domainLogoUrl} alt={`${brandLabel} logo`} fill className="object-contain p-1" sizes="32px" />
                </span>
              ) : (
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                  <Code2 size={16} />
                </span>
              )}
              <span className="font-mono font-semibold text-sm">{renderBrandLabel()}</span>
            </div>

            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className={cn("w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto pt-8 space-y-3">
              <ThemeToggle />
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleNavClick("#contact")}>
                Hire Me
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
