import { BrainCircuit, Briefcase, Code2, Database, Globe, Layers3, Monitor, Palette, Rocket, Shield, Smartphone, Sparkles, Server, Terminal, Users, Wrench } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";
import { ABOUT_SKILL_ICON_DEFAULT, type AboutSkillIconKey } from "@/lib/about-skill-icons";

const SKILL_ICONS: Record<AboutSkillIconKey, typeof Code2> = {
  code: Code2,
  server: Server,
  palette: Palette,
  users: Users,
  layers: Layers3,
  wrench: Wrench,
  sparkles: Sparkles,
  globe: Globe,
  database: Database,
  monitor: Monitor,
  smartphone: Smartphone,
  terminal: Terminal,
  shield: Shield,
  rocket: Rocket,
  brain: BrainCircuit,
  briefcase: Briefcase,
};

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
  const shouldUseSkillCarousel = content.skills.length > 5;
  const shouldCenterLastSkillCard = !shouldUseSkillCarousel && content.skills.length % 2 === 1;
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
                        {skillsGroup.map(({ title, items, icon }, index) => {
                          const Icon = SKILL_ICONS[icon ?? ABOUT_SKILL_ICON_DEFAULT] ?? SKILL_ICONS[ABOUT_SKILL_ICON_DEFAULT];

                          return (
                            <div key={`${title}-${groupIndex}-${index}`} className="mx-auto my-2 w-3/4 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
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
              {content.skills.map(({ title, items, icon }, index) => {
                const Icon = SKILL_ICONS[icon ?? ABOUT_SKILL_ICON_DEFAULT] ?? SKILL_ICONS[ABOUT_SKILL_ICON_DEFAULT];
                const isLastSkillCard = shouldCenterLastSkillCard && index === content.skills.length - 1;

                return (
                  <div
                    key={`${title}-${index}`}
                    className={`${
                      isLastSkillCard
                        ? "bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors col-span-2 justify-self-center w-full max-w-[calc(50%-0.5rem)]"
                        : "bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                    }`}
                  >
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
