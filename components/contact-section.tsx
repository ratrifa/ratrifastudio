"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { defaultHeroContent } from "@/lib/hero-content";
import { useState } from "react";

const CONTACT_EMAIL = "satriafebriandanu@gmail.com";

const buildSocialLinks = (social?: { githubUrl?: string | null; linkedinUrl?: string | null; twitterUrl?: string | null }) => {
  const source = social ?? defaultHeroContent;

  return [
    source.githubUrl ? { icon: Github, href: source.githubUrl, label: "GitHub" } : null,
    source.linkedinUrl ? { icon: Linkedin, href: source.linkedinUrl, label: "LinkedIn" } : null,
    source.twitterUrl ? { icon: Twitter, href: source.twitterUrl, label: "Twitter" } : null,
  ].filter(Boolean) as Array<{ icon: typeof Github; href: string; label: string }>;
};

export function ContactSection({ social }: { social?: { githubUrl?: string | null; linkedinUrl?: string | null; twitterUrl?: string | null } }) {
  const socialLinks = buildSocialLinks(social);
  const [submitState, setSubmitState] = useState<{ status: "idle" | "loading" | "success" | "error"; message?: string }>({ status: "idle" });

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subjectInput = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitState({ status: "error", message: "Nama, email, dan pesan wajib diisi." });
      return;
    }

    const subject = subjectInput || `Portfolio Inquiry from ${name}`;
    const body = [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n");
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSubmitState({ status: "loading", message: "Membuka aplikasi email..." });
    window.location.href = mailtoUrl;
    formElement.reset();
    setSubmitState({ status: "success", message: "Draft email sudah disiapkan di aplikasi email kamu." });
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">{"//"}</span> Contact
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Let&apos;s work together</h2>
            <p className="text-muted-foreground leading-relaxed">Gue selalu terbuka untuk kesempatan baru, kolaborasi project, atau sekadar ngobrol soal teknologi. Feel free to reach out!</p>

            <div className="flex flex-col gap-3.5 mt-2 font-mono text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail size={15} className="text-primary shrink-0" strokeWidth={1.75} />
                {CONTACT_EMAIL}
              </a>
              <a href="tel:+6281234567890" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone size={15} className="text-primary shrink-0" strokeWidth={1.75} />
                +62 821-7721-3800
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={15} className="text-primary shrink-0" strokeWidth={1.75} />
                Bandung, Indonesia
              </div>
            </div>

            <div className="flex items-center gap-5 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/5">
            {/* macOS-style title bar, echoes the splash terminal */}
            <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">new-message.tsx</span>
              <span className="size-2.5" aria-hidden="true" />
            </div>

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs font-medium text-muted-foreground">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    className="bg-secondary border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    required
                    className="bg-secondary border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-xs font-medium text-muted-foreground">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What's this about?"
                  className="bg-secondary border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs font-medium text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project or idea..."
                  required
                  className="bg-secondary border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors resize-none"
                />
              </div>
              <Button type="submit" disabled={submitState.status === "loading"} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2">
                {submitState.status === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-4" />
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Message
                    <ArrowUpRight size={15} />
                  </>
                )}
              </Button>
              {submitState.message ? <p className={`text-xs ${submitState.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{submitState.message}</p> : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
