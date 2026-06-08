import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ExternalLink, CalendarDays, Building2 } from "lucide-react";

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
      <section id="certificates" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-muted-foreground text-center py-16">No certificates yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-14">
          <p className="font-mono text-xs text-muted-foreground">{"// credentials.log"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Credentials & achievements</h2>
          <p className="text-muted-foreground max-w-lg leading-relaxed">Sertifikasi dan credential yang udah gue raih sebagai bukti komitmen gue dalam terus belajar dan berkembang.</p>
        </div>

        {/* Ledger-style list */}
        <ul className="flex flex-col border-t border-border">
          {certificates.map((cert) => {
            const Wrapper = cert.credential_url ? "a" : "div";
            const wrapperProps = cert.credential_url ? { href: cert.credential_url, target: "_blank", rel: "noopener noreferrer" } : {};

            return (
              <li key={cert.id} className="border-b border-border">
                <Wrapper
                  {...wrapperProps}
                  className={`group flex items-center gap-5 py-5 ${cert.credential_url ? "cursor-pointer" : ""}`}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-md border border-border">
                    <ImageWithFallback src={cert.image} alt={cert.title} fill className="object-cover grayscale-[45%] transition-all duration-300 group-hover:grayscale-0" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-semibold text-foreground text-base leading-snug truncate group-hover:text-primary transition-colors">{cert.title}</h3>
                      {cert.featured && <span className="font-mono text-[10px] uppercase tracking-widest text-primary shrink-0">Featured</span>}
                    </div>
                    <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                      <span className="flex items-center gap-1.5">
                        <Building2 size={13} className="text-primary shrink-0" strokeWidth={1.75} />
                        {cert.issuer}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-primary shrink-0" strokeWidth={1.75} />
                        {cert.issued_at}
                      </span>
                    </p>
                    {cert.description && <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2 max-w-2xl">{cert.description}</p>}
                  </div>

                  {cert.credential_url && (
                    <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      Verify
                      <ExternalLink size={13} />
                    </span>
                  )}
                </Wrapper>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
