"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Hero", href: "/admin/hero" },
  { label: "About", href: "/admin/about" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Experiences", href: "/admin/experiences" },
  { label: "Certificates", href: "/admin/certificates" },
];

type AdminNavbarProps = {
  logoutAction: () => Promise<void>;
};

export function AdminNavbar({ logoutAction }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground" aria-label="Admin navigation">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("rounded-md px-3 py-2 font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "hover:text-foreground hover:bg-secondary")}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="hidden md:block shrink-0">
        <Button type="submit" variant="outline" className="shrink-0">
          Logout
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="md:hidden shrink-0 touch-manipulation"
        aria-label="Open admin menu"
        aria-expanded={isMenuOpen}
        aria-controls="admin-mobile-menu"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={20} />
      </Button>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-80 pt-14">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin menu</SheetTitle>
            <SheetDescription>Navigasi admin dan tombol logout.</SheetDescription>
          </SheetHeader>

          <div id="admin-mobile-menu" className="px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Admin menu</p>
            <div className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn("rounded-md px-4 py-3 text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>

            <form action={logoutAction} className="mt-6">
              <Button type="submit" variant="outline" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
