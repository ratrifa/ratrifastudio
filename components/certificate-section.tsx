import Image from "next/image";
import { Award, ExternalLink, CalendarDays, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const featured = certificates.find((c) => c.featured);
  const heroCertificate = featured ?? certificates[0];
  const rest = certificates.filter((c) => c.id !== heroCertificate?.id);

  if (!heroCertificate) {
    return (
      <section id="certificates" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-muted-foreground text-center py-16">No certificates yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Award size={16} />
            </span>
            <span className="text-primary font-mono text-sm tracking-widest uppercase">Certificates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Credentials & Achievements</h2>
          <p className="text-muted-foreground max-w-lg leading-relaxed">Sertifikasi dan credential yang udah gue raih sebagai bukti komitmen gue dalam terus belajar dan berkembang.</p>
        </div>

        {/* Featured certificate - hero layout */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16 p-6 md:p-10 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
          {/* Image */}
          <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border border-border shadow-xl">
            <Image src={heroCertificate.image} alt={heroCertificate.title} fill className="object-cover" />
            {featured ? (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground text-xs font-mono">Featured</Badge>
              </div>
            ) : null}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className="text-primary font-mono text-xs tracking-widest uppercase">{featured ? "Featured Certificate" : "Latest Certificate"}</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-balance leading-tight">{heroCertificate.title}</h3>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Building2 size={14} className="text-primary shrink-0" />
                {heroCertificate.issuer}
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays size={14} className="text-primary shrink-0" />
                Issued {heroCertificate.issued_at}
              </span>
            </div>

            {heroCertificate.description && <p className="text-muted-foreground text-sm leading-relaxed">{heroCertificate.description}</p>}

            {heroCertificate.credential_url && (
              <Button asChild className="w-fit bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <a href={heroCertificate.credential_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  Verify Credential
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Other certificates grid */}
        {rest.length > 0 && (
          <>
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Other Certificates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((cert) => {
                const cardClassName = "group bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 flex flex-col";
                const cardImageClassName = "object-cover transition-transform duration-500 group-hover:scale-105";

                const content = (
                  <>
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image src={cert.image} alt={cert.title} fill className={cardImageClassName} />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{cert.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Building2 size={11} />
                        {cert.issuer}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-auto pt-2">
                        <CalendarDays size={11} />
                        {cert.issued_at}
                      </p>
                    </div>
                  </>
                );

                if (cert.credential_url) {
                  return (
                    <a key={cert.id} href={cert.credential_url} target="_blank" rel="noopener noreferrer" className={`${cardClassName} hover:border-primary/40`}>
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={cert.id} className={cardClassName}>
                    {content}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
