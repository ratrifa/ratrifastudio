"use client";

import { MapPin, ChevronDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_TYPE_LABELS, normalizeExperienceType, type ExperienceTypeValue } from "@/lib/experience-types";
import { useState } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PhotoLightbox } from "@/components/photo-lightbox";
import { SectionHeading, AccentWords } from "@/components/section-heading";
import { Reveal } from "@/components/ui/reveal";

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period_start: string;
  period_end: string | null;
  description: string;
  experienceType?: ExperienceTypeValue;
  photos?: Array<{
    id: string;
    imageUrl: string;
    caption?: string | null;
  }>;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxExpId, setLightboxExpId] = useState<string | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0);

  const timelineItems: Experience[] = [
    ...experiences,
    {
      id: "hardcoded-welcome-satria",
      role: "Welcome, Satria Febry Andanu!",
      company: "Earth",
      period_start: "1 Feb 2005",
      period_end: null,
      description: "oeekk oeekkk",
      experienceType: "full-time",
    },
  ];

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          label="Experience"
          title={<AccentWords text="Where I've been" />}
          description="Rekam jejak gua, mulai dari organisasi dan volunteer semasa kuliah sampai pengalaman kerja nyata di industri."
        />

        {timelineItems.length > 0 ? (
          <ol>
            {timelineItems.map((exp, idx) => {
              const legacyType = (exp as Experience & { type?: Experience["experienceType"] }).type;
              const resolvedType = normalizeExperienceType(exp.experienceType ?? legacyType);
              const isPresent = !exp.period_end;
              const hasPhotos = (exp.photos ?? []).length > 0;
              const isExpanded = expandedId === exp.id;

              return (
                <li key={exp.id} className="border-t border-border">
                  <Reveal delay={Math.min(idx * 0.06, 0.3)} className="grid gap-3 py-10 sm:grid-cols-[200px_1fr] sm:gap-10">
                    {/* Period + type */}
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">
                        {exp.period_start} — {isPresent ? <span className="font-medium text-primary">Now</span> : exp.period_end}
                      </p>
                      {resolvedType && (
                        <p className="mt-2 w-fit rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {EXPERIENCE_TYPE_LABELS[resolvedType] ?? resolvedType}
                        </p>
                      )}
                    </div>

                    {/* Role + details */}
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{exp.role}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{exp.company}</p>
                      {exp.location && (
                        <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {exp.location}
                        </p>
                      )}
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{exp.description}</p>

                      {hasPhotos && (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`photos-${exp.id}`}
                            className={`group mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors ${
                              isExpanded ? "text-primary" : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            <ImageIcon className="size-4" />
                            {(exp.photos ?? []).length} photo{(exp.photos ?? []).length > 1 ? "s" : ""} attached
                            <ChevronDown className={`size-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>

                          <div
                            id={`photos-${exp.id}`}
                            aria-hidden={!isExpanded}
                            inert={!isExpanded}
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "mt-4 max-h-44 opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Dokumentasi</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setLightboxExpId(exp.id);
                                  setLightboxPhotoIndex(0);
                                  setLightboxOpen(true);
                                }}
                                className="h-auto cursor-pointer py-1 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                              >
                                <ImageIcon className="size-3.5" />
                                See all
                              </Button>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                              {(exp.photos ?? []).map((photo, photoIdx) => (
                                <button
                                  key={photo.id}
                                  onClick={() => {
                                    setLightboxExpId(exp.id);
                                    setLightboxPhotoIndex(photoIdx);
                                    setLightboxOpen(true);
                                  }}
                                  className="group relative h-24 w-32 shrink-0 cursor-pointer snap-start overflow-hidden rounded-lg border border-border bg-muted transition-colors hover:border-primary/50"
                                  aria-label={`View photo ${photoIdx + 1} of ${(exp.photos ?? []).length}`}
                                >
                                  <ImageWithFallback src={photo.imageUrl} alt={photo.caption || "Dokumentasi"} fill className="object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" sizes="128px" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="py-16 text-center text-muted-foreground">No experience entries yet.</p>
        )}
      </div>

      {/* Photo Lightbox */}
      {lightboxExpId && <PhotoLightbox photos={timelineItems.find((e) => e.id === lightboxExpId)?.photos ?? []} initialIndex={lightboxPhotoIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />}
    </section>
  );
}
