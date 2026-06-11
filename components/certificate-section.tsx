import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, AccentWords } from "@/components/section-heading";
import { Reveal } from "@/components/ui/reveal";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued_at: string;
  description?: string;
  image: string;
  credential_url?: string;
  featured?: boolean;
}

interface CertificateSectionProps {
  certificates: Certificate[];
}

export function CertificateSection({ certificates }: CertificateSectionProps) {
  if (certificates.length === 0) {
    return (
      <section id="certificates" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            index="04"
            label="Certificates"
            title={<AccentWords text="Credentials & achievements" />}
            description="Sertifikasi dan credential yang udah gua raih sebagai bukti komitmen gua dalam terus belajar dan berkembang."
          />
          <p className="py-16 text-center text-muted-foreground">No certificates yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          label="Certificates"
          title={<AccentWords text="Credentials & achievements" />}
          description="Sertifikasi dan credential yang udah gua raih sebagai bukti komitmen gua dalam terus belajar dan berkembang."
        />

        {/* Ledger-style list */}
        <ul className="border-t border-border">
          {certificates.map((cert, index) => {
            const Wrapper = cert.credential_url ? "a" : "div";
            const wrapperProps = cert.credential_url ? { href: cert.credential_url, target: "_blank", rel: "noopener noreferrer" } : {};

            return (
              <li key={cert.id} className="border-b border-border">
                <Reveal delay={Math.min(index * 0.06, 0.3)}>
                  <Wrapper
                    {...wrapperProps}
                    className={`group flex items-center gap-5 py-6 transition-colors sm:gap-8 ${cert.credential_url ? "cursor-pointer" : ""}`}
                  >
                    <span className="hidden w-8 shrink-0 font-mono text-xs text-muted-foreground sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border sm:size-16">
                      <ImageWithFallback
                        src={cert.image}
                        alt={cert.title}
                        fill
                        className="object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="truncate font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                          {cert.title}
                        </h3>
                        {cert.featured && (
                          <span className="shrink-0 rounded-full border border-primary/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {cert.issuer} · {cert.issued_at}
                      </p>
                      {cert.description && (
                        <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
                      )}
                    </div>

                    {cert.credential_url && (
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="hidden font-mono text-xs text-muted-foreground sm:inline">Verify</span>
                        <span className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowUpRight className="size-4" />
                        </span>
                      </span>
                    )}
                  </Wrapper>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
