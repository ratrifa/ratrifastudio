"use client";

import { Phone, MapPin, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { SectionHeading, AccentWords } from "@/components/section-heading";
import { Reveal } from "@/components/ui/reveal";
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

const fieldClass =
  "w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none";

const labelClass = "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground";

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
    <section id="contact" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="05"
          label="Contact"
          title={<AccentWords text="Let's work together" />}
          description="Gue selalu terbuka untuk kesempatan baru, kolaborasi project, atau sekadar ngobrol soal teknologi. Feel free to reach out!"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left */}
          <Reveal className="lg:col-span-5">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-display text-2xl font-semibold tracking-tight text-foreground underline decoration-primary/40 decoration-2 underline-offset-8 transition-colors break-all hover:decoration-primary sm:text-3xl"
            >
              {CONTACT_EMAIL}
            </a>

            <div className="mt-8 space-y-3 font-mono text-sm text-muted-foreground">
              <a href="tel:+6282177213800" className="flex items-center gap-3 transition-colors hover:text-primary">
                <Phone className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
                +62 821-7721-3800
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
                Bandung, Indonesia
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  {label}
                </a>
              ))}
            </div>
          </Reveal>

          {/* Right: Form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form onSubmit={handleContactSubmit} className="space-y-8">
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Name
                  </label>
                  <input id="contact-name" name="name" type="text" placeholder="Your Name" required className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input id="contact-email" name="email" type="email" placeholder="you@email.com" required className={fieldClass} />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className={labelClass}>
                  Subject
                </label>
                <input id="contact-subject" name="subject" type="text" placeholder="What's this about?" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project or idea..."
                  required
                  className={`${fieldClass} resize-none`}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submitState.status === "loading"}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitState.status === "loading" ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="size-4" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <ArrowUpRight className="size-4" />
                    </>
                  )}
                </button>
                {submitState.message ? (
                  <p className={`mt-3 text-xs ${submitState.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{submitState.message}</p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
