import { defaultAboutContent, type AboutSectionContent } from "@/lib/about-content";

interface AboutSectionProps {
  content?: AboutSectionContent;
  previewAsBanner?: boolean;
}

export function AboutSection({ content = defaultAboutContent, previewAsBanner = false }: AboutSectionProps) {
  const sectionClasses = previewAsBanner ? "relative overflow-hidden py-16 bg-background" : "relative overflow-hidden py-24 bg-background";

  return (
    <section id={previewAsBanner ? undefined : "about"} className={sectionClasses}>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-16 items-start">
          {/* Left: narrative */}
          <div className="flex flex-col gap-6">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">{"//"}</span> About me
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{content.headline}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line max-w-xl">{content.paragraph}</p>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 pt-6 mt-2 border-t border-border max-w-xl">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`}>
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-foreground font-mono mt-1">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: skill manifest, styled like a config/log readout */}
          <div className="font-mono text-sm">
            <p className="text-xs text-muted-foreground mb-4">{"// stack.toml"}</p>
            <ul className="flex flex-col">
              {content.skills.map(({ title, items }, index) => (
                <li key={`${title}-${index}`} className={`py-4 ${index > 0 ? "border-t border-border" : ""}`}>
                  <p className="text-foreground text-xs uppercase tracking-wider">
                    <span className="text-primary">{"["}</span>
                    {title}
                    <span className="text-primary">{"]"}</span>
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-2">
                    {items.map((item, itemIndex) => (
                      <span key={`${item}-${itemIndex}`}>
                        {itemIndex > 0 && <span className="text-border"> · </span>}
                        {item}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
