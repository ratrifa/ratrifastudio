"use client";

import { MapPin, ChevronDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_TYPE_LABELS, normalizeExperienceType, type ExperienceTypeValue } from "@/lib/experience-types";
import { useState } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PhotoLightbox } from "@/components/photo-lightbox";

function shortHash(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).slice(0, 7).padEnd(7, "0");
}

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
    <section id="experience" className="relative overflow-hidden py-24">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-10">
          <p className="font-mono text-xs text-muted-foreground">{"// career.log"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Where I&apos;ve worked</h2>
          <p className="text-muted-foreground max-w-lg leading-relaxed">Perjalanan karir gue di dunia web development — dari masa belajar sampai terlibat dalam proyek-proyek nyata yang berdampak.</p>
        </div>

        {/* Experience log — styled like `git log`, echoes the loading-screen terminal */}
        {timelineItems.length > 0 ? (
          <div className="rounded-md border border-border overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">git log --reverse career</span>
              <span className="size-2.5" aria-hidden="true" />
            </div>

            <div className="flex flex-col font-mono">
              {timelineItems.map((exp, idx) => {
                const legacyType = (exp as Experience & { type?: Experience["experienceType"] }).type;
                const resolvedType = normalizeExperienceType(exp.experienceType ?? legacyType);
                const isPresent = !exp.period_end;
                const hasPhotos = (exp.photos ?? []).length > 0;
                const isExpanded = expandedId === exp.id;

                return (
                  <article key={exp.id} className={`px-4 sm:px-5 py-4 ${idx > 0 ? "border-t border-border" : ""}`}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
                      <span className={isPresent ? "text-primary" : "text-muted-foreground/70"}>
                        commit {shortHash(exp.id)}
                        {isPresent && <span className="ml-1.5 text-primary">(HEAD)</span>}
                      </span>
                      <span className="text-foreground/80 font-medium">
                        {exp.period_start}
                        {" → "}
                        {exp.period_end ?? "present"}
                      </span>
                      {resolvedType && <span className="text-muted-foreground/70">[{(EXPERIENCE_TYPE_LABELS[resolvedType] ?? resolvedType).toLowerCase()}]</span>}
                    </div>

                    <div className="mt-2.5 pl-4 border-l-2 border-border">
                      <p className="text-sm text-foreground font-semibold">
                        {exp.role} <span className="text-muted-foreground font-normal">@ {exp.company}</span>
                      </p>
                      {exp.location && (
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5 mt-1">
                          <MapPin size={11} />
                          {exp.location}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-2xl">{exp.description}</p>

                      {hasPhotos && (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`photos-${exp.id}`}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors mt-3 cursor-pointer ${
                              isExpanded ? "text-primary" : "text-primary/80 hover:text-primary"
                            }`}
                          >
                            <ImageIcon size={14} />
                            {(exp.photos ?? []).length} photo{(exp.photos ?? []).length > 1 ? "s" : ""} attached
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>

                          <div
                            id={`photos-${exp.id}`}
                            aria-hidden={!isExpanded}
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-44 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Dokumentasi</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setLightboxExpId(exp.id);
                                  setLightboxPhotoIndex(0);
                                  setLightboxOpen(true);
                                }}
                                className="h-auto py-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <ImageIcon size={13} className="mr-1" />
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
                                  className="group relative h-28 w-28 shrink-0 snap-start overflow-hidden rounded-md border border-border bg-muted cursor-pointer transition-all hover:border-primary/50"
                                  aria-label={`View photo ${photoIdx + 1} of ${(exp.photos ?? []).length}`}
                                >
                                  <ImageWithFallback src={photo.imageUrl} alt={photo.caption || "Dokumentasi"} fill className="object-cover grayscale-[40%] transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105" sizes="112px" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-16">No experience entries yet.</p>
        )}
      </div>

      {/* Photo Lightbox */}
      {lightboxExpId && <PhotoLightbox photos={timelineItems.find((e) => e.id === lightboxExpId)?.photos ?? []} initialIndex={lightboxPhotoIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />}
    </section>
  );
}
