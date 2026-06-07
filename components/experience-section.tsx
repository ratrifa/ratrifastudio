"use client";

import { Briefcase, MapPin, ChevronDown, ImageIcon } from "lucide-react";
import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_TYPE_LABELS, normalizeExperienceType, type ExperienceTypeValue } from "@/lib/experience-types";
import { useState } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PhotoLightbox } from "@/components/photo-lightbox";

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
      <BubbleBackground
        interactive={true}
        className="absolute inset-0 z-0 opacity-30 bg-transparent mask-[linear-gradient(to_bottom,transparent_0%,white_16%,white_84%,transparent_100%)]"
        colors={{
          first: "94,23,235",
          second: "139,92,246",
          third: "59,130,246",
          fourth: "124,58,237",
          fifth: "99,102,241",
          sixth: "168,85,247",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Briefcase size={16} />
            </span>
            <span className="text-primary font-mono text-sm tracking-widest uppercase">Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Where I&apos;ve worked</h2>
          <p className="text-muted-foreground max-w-lg leading-relaxed">Perjalanan karir gue di dunia web development — dari masa belajar sampai terlibat dalam proyek-proyek nyata yang berdampak.</p>
        </div>

        {/* Experience timeline */}
        {timelineItems.length > 0 ? (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-0 md:left-63.5 top-0 bottom-0 w-px bg-border hidden md:block" aria-hidden="true" />

            <div className="flex flex-col gap-10">
              {timelineItems.map((exp, idx) => {
                const legacyType = (exp as Experience & { type?: Experience["experienceType"] }).type;
                const resolvedType = normalizeExperienceType(exp.experienceType ?? legacyType);

                return (
                  <article key={exp.id} className="flex flex-col md:flex-row gap-4 md:gap-8 relative">
                    {/* Period - left column on desktop */}
                    <div className="md:w-52 md:text-right shrink-0">
                      <time className="font-mono text-sm text-muted-foreground leading-relaxed">
                        {exp.period_start}
                        {" — "}
                        {exp.period_end ?? <span className="text-primary font-semibold">Present</span>}
                      </time>
                    </div>

                    {/* Dot on timeline */}
                    <div className="hidden md:flex items-start justify-center w-7 shrink-0 pt-0.5 relative z-10" aria-hidden="true">
                      <span
                        className={`w-3 h-3 rounded-xl transition-all ease-in-out duration-500 border-2 border-primary ${idx === 0 && !exp.period_end ? "bg-primary animate-pulse" : "bg-background"} ${expandedId === exp.id ? "bg-primary animate-ping" : ""}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-card/20 backdrop-blur-xs rounded-xl border border-border hover:border-primary/30 transition-colors overflow-hidden">
                      <div className="w-full p-5 flex flex-col gap-3 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-base">{exp.role}</h3>
                            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                              {exp.company}
                              {exp.location && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <MapPin size={12} />
                                  {exp.location}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {resolvedType && (
                              <Badge variant="secondary" className="text-xs font-mono bg-primary/15 text-muted-foreground border border-primary/35 dark:bg-primary/20 dark:border-primary/45">
                                {EXPERIENCE_TYPE_LABELS[resolvedType] ?? resolvedType}
                              </Badge>
                            )}
                            {(exp.photos ?? []).length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(expandedId === exp.id ? null : exp.id);
                                }}
                                aria-expanded={expandedId === exp.id}
                                aria-controls={`photos-${exp.id}`}
                                className={`p-0.5 rounded-md transition-all duration-300 ease-in-out text-muted-foreground cursor-pointer hover:bg-primary/70`}
                              >
                                <ChevronDown size={18} className={`transition-all duration-300 ease-in-out ${expandedId === exp.id ? "rotate-180" : ""}`}></ChevronDown>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                      </div>

                      {/* Photos gallery - animated container (controlled by chevron button) */}
                      {(exp.photos ?? []).length > 0 && (
                        <div
                          id={`photos-${exp.id}`}
                          aria-hidden={expandedId !== exp.id}
                          className={`px-5 transition-all duration-300 ease-in-out overflow-hidden ${expandedId === exp.id ? "max-h-96 pb-5 opacity-100" : "max-h-0 py-0 opacity-0"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dokumentasi Foto ({(exp.photos ?? []).length})</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setLightboxExpId(exp.id);
                                setLightboxPhotoIndex(0);
                                setLightboxOpen(true);
                              }}
                              className="text-xs text-primary hover:text-white hover:bg-primary/10"
                            >
                              <ImageIcon size={14} className="mr-1" />
                              See Photos
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
                                className="group relative h-50 w-50 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-muted cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:ring-2 hover:ring-primary/30 sm:h-32 sm:w-32 md:h-36 md:w-36"
                                aria-label={`View photo ${photoIdx + 1} of ${(exp.photos ?? []).length}`}
                              >
                                <ImageWithFallback src={photo.imageUrl} alt={photo.caption || "Dokumentasi"} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
                              </button>
                            ))}
                          </div>
                        </div>
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
