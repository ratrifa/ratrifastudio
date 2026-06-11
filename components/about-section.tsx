import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";
import { AccentWords, SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/ui/reveal";

interface AboutSectionProps {
  content?: AboutSectionContent;
  previewAsBanner?: boolean;
}

export function AboutSection({ content = defaultAboutContent, previewAsBanner = false }: AboutSectionProps) {
  const sectionClasses = previewAsBanner ? "bg-background py-16" : "bg-background py-24 sm:py-32";
  const paragraphs = content.paragraph.split(/\n+/).filter((paragraph) => paragraph.trim().length > 0);
  const [lead, ...rest] = paragraphs;

  return (
    <section id={previewAsBanner ? undefined : "about"} className={sectionClasses}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="01" label="About" title={<AccentWords text={content.headline} />} />

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: narrative + stats */}
          <Reveal className="lg:col-span-7">
            {lead && <p className="text-xl leading-relaxed text-foreground sm:text-2xl">{lead}</p>}
            {rest.length > 0 && (
              <div className="mt-6 space-y-5">
                {rest.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="flex flex-col border-l-2 border-primary/50 pl-5">
                  <dt className="order-2 mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Right: skill groups */}
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            {content.skills.map(({ title, items }, index) => (
              <Reveal key={`${title}-${index}`} delay={Math.min(index * 0.06, 0.3)}>
                <div className="border-t border-border py-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">{title}</h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {items.map((item, itemIndex) => (
                      <li
                        key={`${item}-${itemIndex}`}
                        className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
