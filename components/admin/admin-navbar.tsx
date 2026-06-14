"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { FormSubmitButton } from "@/components/admin/form-submit-button";
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
  { label: "Messages", href: "/admin/messages" },
];

type AdminNavbarProps = {
  logoutAction: () => Promise<void>;
  messagesUnreadCount?: number;
};

export function AdminNavbar({ logoutAction, messagesUnreadCount = 0 }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex" aria-label="Admin navigation">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const showBadge = link.href === "/admin/messages" && messagesUnreadCount > 0;

          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={cn("relative rounded-md px-3 py-2 font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary hover:text-foreground")}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
              {showBadge && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {messagesUnreadCount > 9 ? "9+" : messagesUnreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="hidden shrink-0 md:block">
        <FormSubmitButton pendingLabel="Logging out..." variant="outline" className="shrink-0">
          Logout
        </FormSubmitButton>
      </form>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0 touch-manipulation md:hidden"
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
                const showBadge = link.href === "/admin/messages" && messagesUnreadCount > 0;

                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      className={cn("relative rounded-md px-4 py-3 text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                      {showBadge && (
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                          {messagesUnreadCount > 9 ? "9+" : messagesUnreadCount}
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>

            <form action={logoutAction} className="mt-6">
              <FormSubmitButton pendingLabel="Logging out..." variant="outline" className="w-full">
                Logout
              </FormSubmitButton>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
