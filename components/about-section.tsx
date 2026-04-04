import { Code2, Palette, Users, Zap } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";

const SKILL_ICONS = [Code2, Zap, Palette, Users] as const;

interface AboutSectionProps {
  content?: AboutSectionContent;
  previewAsBanner?: boolean;
}

function chunkSkills<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export function AboutSection({ content = defaultAboutContent, previewAsBanner = false }: AboutSectionProps) {
  const sectionClasses = previewAsBanner ? "py-16 bg-background" : "py-24 bg-background";
  const shouldUseSkillCarousel = content.skills.length > 4;
  const skillSlides = chunkSkills(content.skills, 1);

  return (
    <section id={previewAsBanner ? undefined : "about"} className={sectionClasses}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-primary font-mono text-sm tracking-widest uppercase">About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{content.headline}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.paragraph}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="text-center p-4 rounded-xl bg-card border border-border">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {shouldUseSkillCarousel ? (
            <div className="relative h-full flex items-center justify-center md:min-h-105">
              <Carousel opts={{ align: "start" }} className="w-full max-w-85">
                <CarouselContent className="ml-0">
                  {skillSlides.map((skillsGroup, groupIndex) => (
                    <CarouselItem key={`skills-slide-${groupIndex}`} className="pl-0 flex items-center justify-center">
                      <div className="grid grid-cols-1 gap-4 py-2 w-full">
                        {skillsGroup.map(({ title, items }, index) => {
                          const iconIndex = groupIndex + index;
                          const Icon = SKILL_ICONS[iconIndex % SKILL_ICONS.length];

                          return (
                            <div key={`${title}-${iconIndex}`} className="mx-auto my-2 w-3/4 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-primary/20">
                                  <Icon size={15} />
                                </span>
                                <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                              </div>
                              <ul className="flex flex-col gap-2">
                                {items.map((item, itemIndex) => (
                                  <li key={`${item}-${itemIndex}`} className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {content.skills.map(({ title, items }, index) => {
                const Icon = SKILL_ICONS[index % SKILL_ICONS.length];

                return (
                  <div key={`${title}-${index}`} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary border border-primary/20">
                        <Icon size={15} />
                      </span>
                      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {items.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
