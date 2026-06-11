import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Kata terakhir di-render dengan Instrument Serif italic — motif tipografi
 * khas heading di seluruh site. `accentClass` opsional untuk mewarnai
 * kata aksen (hero pakai "text-primary").
 */
export function AccentWords({ text, accentClass }: { text: string; accentClass?: string }) {
  const words = text.trim().split(/\s+/);

  if (words.length < 2) {
    return <em className={cn("font-serif font-normal italic", accentClass)}>{text}</em>;
  }

  const head = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  return (
    <>
      {head}{" "}
      <em className={cn("font-serif font-normal italic", accentClass)}>{tail}</em>
    </>
  );
}

interface SectionHeadingProps {
  /** Index dua digit, mis. "01" */
  index: string;
  /** Label pendek di samping index, mis. "Selected Work" */
  label: string;
  /** Heading besar — biasanya <AccentWords text="..." /> */
  title: React.ReactNode;
  description?: string;
  /** Teks mono kecil di ujung kanan baris label, mis. "(6)" */
  meta?: string;
  className?: string;
}

/**
 * Masthead section standar: hairline rule → baris `01 / Label` → heading
 * display besar → deskripsi singkat. Dipakai SEMUA section publik.
 */
export function SectionHeading({ index, label, title, description, meta, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-14 sm:mb-20", className)}>
      <header>
        <div className="flex items-baseline justify-between gap-4 border-t border-border pt-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-primary">{index}</span> / {label}
          </p>
          {meta && <p className="font-mono text-xs text-muted-foreground">{meta}</p>}
        </div>
        <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {description && <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{description}</p>}
      </header>
    </Reveal>
  );
}
