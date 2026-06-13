"use client";

import { MapPin, ChevronDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_TYPE_LABELS, normalizeExperienceType, type ExperienceTypeValue } from "@/lib/experience-types";
import { useState, useRef, useEffect } from "react";
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
  category?: string;
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
  const [expandedDescIds, setExpandedDescIds] = useState<Set<string>>(new Set());
  const toggleDesc = (id: string) => setExpandedDescIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const [overflowingDescIds, setOverflowingDescIds] = useState<Set<string>>(new Set());
  const descContainerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  useEffect(() => {
    const COLLAPSED_H = 72; // 4.5rem @ 16px
    const check = () => {
      const next = new Set<string>();
      descContainerRefs.current.forEach((el, id) => { if (el && el.scrollHeight > COLLAPSED_H) next.add(id); });
      setOverflowingDescIds(next);
    };
    check();
    const ro = new ResizeObserver(check);
    descContainerRefs.current.forEach((el) => { if (el) ro.observe(el); });
    return () => ro.disconnect();
  }, [experiences]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxExpId, setLightboxExpId] = useState<string | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0);

  const hasCategories = experiences.some((e) => e.category);

  const groups: { title: string | null; items: Experience[] }[] = hasCategories
    ? [
        {
          title: "Pengalaman Kerja",
          items: experiences.filter((e) => !e.category || e.category === "WORK"),
        },
        {
          title: "Pengalaman Kuliah",
          items: experiences.filter((e) => e.category === "EDUCATION"),
        },
      ].filter((g) => g.items.length > 0)
    : [{ title: null, items: experiences }];

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          label="Experience"
          title={<AccentWords text="Where I've been" />}
          description="Rekam jejak gua, mulai dari organisasi dan volunteer semasa kuliah sampai pengalaman kerja nyata di industri."
        />

        <div className={groups.length > 1 ? "grid grid-cols-1 md:grid-cols-2 md:gap-x-12" : ""}>
        {groups.map((group) => (
          <div key={group.title ?? "all"}>
            {group.title && (
              <p className="mb-2 mt-12 font-mono text-xs uppercase tracking-widest text-muted-foreground md:mt-0">
                {group.title}
              </p>
            )}
            {group.items.length > 0 ? (
          <ol>
            {group.items.map((exp, idx) => {
              const legacyType = (exp as Experience & { type?: Experience["experienceType"] }).type;
              const resolvedType = normalizeExperienceType(exp.experienceType ?? legacyType);
              const isPresent = !exp.period_end;
              const hasPhotos = (exp.photos ?? []).length > 0;
              const isExpanded = expandedId === exp.id;

              return (
                <li key={exp.id} className="border-t border-border">
                  <Reveal delay={Math.min(idx * 0.06, 0.3)} className="py-5">
                    {/* Period + type: inline row */}
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-mono text-xs text-muted-foreground">
                        {exp.period_start} — {isPresent ? <span className="font-medium text-primary">Now</span> : exp.period_end}
                      </p>
                      {resolvedType && (
                        <p className="w-fit rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {EXPERIENCE_TYPE_LABELS[resolvedType] ?? resolvedType}
                        </p>
                      )}
                    </div>

                    {/* Role + details */}
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{exp.role}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{exp.company}</p>
                      {exp.location && (
                        <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {exp.location}
                        </p>
                      )}
                      <div
                        ref={(el) => { descContainerRefs.current.set(exp.id, el); }}
                        className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${expandedDescIds.has(exp.id) ? "max-h-[600px]" : "max-h-[4.5rem]"}`}
                      >
                        <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                      </div>
                      {overflowingDescIds.has(exp.id) && (
                        <button type="button" onClick={() => toggleDesc(exp.id)} className="mt-1 flex cursor-pointer items-center gap-1 text-xs text-primary hover:underline">
                          {expandedDescIds.has(exp.id) ? "Show less" : "Read more"}
                          <ChevronDown className={`size-3 transition-transform duration-300 ${expandedDescIds.has(exp.id) ? "rotate-180" : ""}`} />
                        </button>
                      )}

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
                                  <ImageWithFallback src={photo.imageUrl} alt={photo.caption || "Dokumentasi"} fill className="object-cover img-hover-zoom" sizes="128px" />
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
        ))}
        </div>
      </div>

      {/* Photo Lightbox */}
      {lightboxExpId && <PhotoLightbox photos={groups.flatMap((g) => g.items).find((e) => e.id === lightboxExpId)?.photos ?? []} initialIndex={lightboxPhotoIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />}
    </section>
  );
}
