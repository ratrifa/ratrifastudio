# ratrifa.studio — Design System ("Editorial Studio")

Single source of truth untuk UI publik. Semua section WAJIB mengikuti idiom di sini supaya kohesif. (Menggantikan design guide lama yang bergaya terminal/git-log.)

## 1. Identity

Konsep: **portfolio developer dengan rasa editorial/studio** — tipografi besar jadi bintang, hairline rules sebagai struktur, satu aksen violet, motif index `01 /` yang berulang. Hindari: card-grid seragam, eyebrow `// comment` di tiap section, window chrome macOS berulang (terminal motif HANYA hidup di loading screen).

## 2. Fonts (dikonfigurasi di `app/layout.tsx` + `globals.css`)

| Token / class | Font | Pakai untuk |
|---|---|---|
| `font-display` | Bricolage Grotesque | Semua heading (h1–h3), angka stat besar, wordmark footer, judul card |
| `font-sans` (default) | Inter | Body text |
| `font-serif` | Instrument Serif (400, italic) | HANYA kata aksen di heading via `<AccentWords>` |
| `font-mono` | JetBrains Mono | Index number, label kecil uppercase, meta (tanggal, tech tags) |

Heading idiom: `font-display font-semibold tracking-tight` (h1 hero pakai `tracking-[-0.03em] leading-[1.05]`).

## 3. Color tokens (dikonfigurasi di `globals.css`)

Pakai HANYA semantic tokens: `background`, `foreground`, `card`, `border`, `muted`, `muted-foreground`, `secondary`, `primary` (violet), `primary-foreground`. Dark = default (ink violet gelap, aksen periwinkle terang). JANGAN hardcode hex kecuali traffic-light dots di loading screen.

- `text-primary` untuk: index number pada masthead, hover link, dot status, detail aksen kecil.
- Jangan mewarnai heading penuh dengan primary.

## 4. Shared components (SUDAH ADA — wajib dipakai)

### `components/ui/reveal.tsx`
```tsx
<Reveal delay={0.1} y={24} className="...">...</Reveal>
```
Scroll-reveal (fade + slide-up, sekali, respects reduced-motion). Bungkus tiap blok konten utama. Stagger list: `delay={Math.min(index * 0.06, 0.3)}`.

### `components/section-heading.tsx`
```tsx
<SectionHeading
  index="02"
  label="Selected Work"
  title={<AccentWords text="Things I've built" />}
  description="optional, max ~1 kalimat"
  meta="optional, mono kecil di kanan baris label (mis. jumlah item)"
/>
```
Render: hairline rule full-width (border-t) → baris `02 / Selected Work` (mono, uppercase, index ber-`text-primary`) → heading display besar → deskripsi. JANGAN bikin header section sendiri.

`<AccentWords text="..." />` → kata terakhir jadi Instrument Serif italic. Prop `accentClass` opsional (hero pakai `text-primary`).

## 5. Layout rhythm

- Container: `mx-auto max-w-6xl px-6` (SEMUA section sama).
- Section padding: `py-24 sm:py-32`. Section pakai `id` yang sudah ada: `home, about, projects, experience, certificates, contact`.
- Pemisah visual antar konten = hairline `border-t border-border` rows, BUKAN card box.

## 6. Interaction idioms (konsisten di semua section)

- **Pill button (primary)**: `inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:gap-3 cursor-pointer`
- **Pill button (outline)**: sama tapi `border border-border bg-transparent text-foreground hover:bg-secondary`
- **Chip** (tech/skill): `rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground`
- **Arrow link**: `group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary` + `<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />`
- **Icon circle**: `flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary`
- **Image hover**: `transition-all duration-700 group-hover:scale-[1.03]` + grayscale ringan `grayscale-[30%] group-hover:grayscale-0`. Container `overflow-hidden rounded-xl border border-border`.
- Ikon: lucide-react saja, ukuran via `size-4`/`size-5`, no emoji.
- Semua interaktif: `cursor-pointer`, focus ring sudah global.

## 7. Per-section blueprint

### Navbar (`components/navbar.tsx`)
Floating pill nav, selalu center: outer `fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4`; inner pill `flex items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-300` — sebelum scroll `border-transparent bg-transparent`, setelah scroll (`scrolled`) `border-border bg-background/75 backdrop-blur-md shadow-lg shadow-black/5`. Isi: brand (logo box `size-8 rounded-full overflow-hidden` / fallback Code2 + label mono semibold, brandLabel TLD setelah titik terakhir di-`text-primary` — keep helper) → links desktop: tiap link `relative rounded-full px-3.5 py-1.5 text-sm font-medium`; active: span `absolute inset-0 rounded-full bg-secondary` via motion `layoutId="nav-pill"` (import { motion } from "motion/react"), label `relative z-10`, active `text-foreground`, inactive `text-muted-foreground hover:text-foreground` → divider `h-5 w-px bg-border mx-1` → ThemeToggle → mobile Sheet (trigger ghost icon). Mobile sheet: brand di atas, links `font-display text-2xl font-semibold` kolom kiri (active `text-primary`), ThemeToggle di bawah. KEEP: scroll-spy logic, handleNavClick, props `{domainLabel, domainLogoUrl}`, NAV_LINKS.

### Hero (`components/hero-section.tsx`) — komposisi editorial "giant wordmark"
`min-h-screen flex items-center relative overflow-hidden` (previewAsBanner: `min-h-[440px]`, tanpa id, tanpa marquee absolut). Background: `bg-grid-fade` + glow primary blur.
**Row 1** — grid `lg:grid-cols-12`: kiri (col-span-5): square marker `size-2.5 bg-primary` (SHARP, satu-satunya elemen non-rounded — aksen editorial khas hero) + badgeLabel mono uppercase tracking lebar → tagline = `content.headline` di-render **uppercase** `text-base sm:text-lg font-semibold tracking-[0.06em] max-w-sm` → description muted → `{name} — {role}` mono xs. Kanan (col-span-7): figure portrait `aspect-[4/5] max-w-sm` **duotone violet**: img `grayscale contrast-[1.06]` + overlay `bg-primary/75 mix-blend-color` + `bg-primary/15 mix-blend-multiply`, semua hilang saat hover (`group-hover:opacity-0`, `group-hover:grayscale-0`) — varian dari idiom image-hover §6; figcaption mono xs: `[{statusBadgeDetail}]` (bracket label) + dot status & badgeLabel.
**Row 2** — grid `lg:grid-cols-12 items-end`: h1 wordmark raksasa (col-span-8) dari `domainLabel` pecah di titik terakhir: main `font-display font-semibold tracking-[-0.04em] leading-[0.85] text-[clamp(4rem,15vw,11.5rem)]`, TLD overlap di bawahnya `font-serif italic text-primary text-[clamp(2.25rem,8vw,6.25rem)] -mt-[0.4em] ml-[34%]` (ala "DOWN TOWN *Kayoto*"). Kanan (col-span-4, items-end): CTA pills (primary "See my work" + outline "Download CV") + social row "Find me on" + icon circles.
Bawah (bukan previewAsBanner): full-bleed **spec strip** statis (`absolute bottom-0 border-t border-border bg-background/60 backdrop-blur`) — techTags sebagai sel data-sheet: leading cell square `size-1.5 bg-primary` + "STACK" mono uppercase, lalu tiap tag sel `flex-1 border-l border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em]` dengan index mono 2 digit `text-primary` + nama tag, hover `bg-secondary/40`. Mobile: overflow-x-auto tanpa scrollbar. TANPA animasi marquee (terlalu mainstream). previewAsBanner: techTags chips biasa, semua ukuran dikompakkan.
KEEP: props & previewAsBanner berfungsi, semua content dari CMS, socialLinks builder, handleDownloadCv. h1 halaman = wordmark (headline jadi tagline `<p>`).

### About (`components/about-section.tsx`)
SectionHeading index="01" label="About" title={AccentWords(content.headline)}. Grid `lg:grid-cols-12 gap-12 lg:gap-16 items-start`.
Kiri `lg:col-span-7`: split `content.paragraph.split(/\n+/)` → paragraf pertama = lead `text-xl sm:text-2xl leading-relaxed text-foreground`, sisanya `text-muted-foreground leading-relaxed` (`space-y-5 mt-6`). Stats `mt-12 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10`: tiap stat `border-l-2 border-primary/50 pl-5` — value `font-display text-4xl sm:text-5xl font-semibold tracking-tight`, label `mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground`. (dl/dt/dd semantics keep.)
Kanan `lg:col-span-5 lg:sticky lg:top-28`: skills — tiap group `border-t border-border py-6`: baris judul (index mono `0${i+1}` text-primary text-xs + title `text-sm font-semibold uppercase tracking-[0.18em]`), lalu `mt-4 flex flex-wrap gap-2` chips (idiom §6). Bungkus group dengan Reveal stagger.
KEEP: props + previewAsBanner (banner: py-16, tanpa id).

### Projects (`components/projects-section.tsx` + `components/project-card.tsx`)
SectionHeading index="02" label="Selected Work" meta={`(${projects.length})`} title={<AccentWords text="Things I've built" />} description=keep copy Indo existing.
Project pertama = **featured**: article group grid `lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20`: image `lg:col-span-7` Link ke detail, `aspect-[16/10]` (idiom image §6, `rounded-2xl`); teks `lg:col-span-5`: index mono `01` text-primary → title `font-display text-2xl sm:text-3xl font-semibold tracking-tight` → desc `line-clamp-3` → chips tech `flex flex-wrap gap-2` → links row.
Sisanya grid `sm:grid-cols-2 gap-x-8 gap-y-16`. ProjectCard biasa: Link(image): `aspect-[16/11] rounded-xl` + index chip kiri-atas `rounded-full bg-background/70 px-2.5 py-1 font-mono text-[11px] backdrop-blur` + arrow circle kanan-atas muncul saat hover (`opacity-0 group-hover:opacity-100 transition-opacity` + ArrowUpRight, `bg-background/80 backdrop-blur`). Bawah: title (Link, `font-display text-xl font-semibold` + arrow nudge), desc `line-clamp-2`, tech mono xs (maks 5 + `+n`, separator `·` ber-`text-border`), links row `mt-4 flex gap-5` (Demo→ExternalLink, Code→Github; arrow-link idiom).
JANGAN nest anchor. Index global: featured=01, grid mulai 02 (pass `index` prop). KEEP `export interface Project` PERSIS; boleh tambah prop opsional `featured`. Empty state keep.

### Experience (`components/experience-section.tsx`)
SectionHeading index="03" label="Experience" title={<AccentWords text="Where I've been" />} description=keep copy.
HAPUS git-log/terminal chrome & shortHash. Timeline ledger: `<ol>` rows `grid gap-3 sm:grid-cols-[200px_1fr] sm:gap-10 border-t border-border py-10` (Reveal stagger). Kolom kiri: period mono text-sm text-muted-foreground — `{period_start} — {period_end ?? "Now"}`, "Now" dibungkus `text-primary font-medium`; di bawahnya type pill `mt-2 w-fit rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground` (pakai EXPERIENCE_TYPE_LABELS). Kolom kanan: role `font-display text-xl sm:text-2xl font-semibold tracking-tight`; company `mt-1 text-sm text-muted-foreground`; location keep jika ada (MapPin size-3.5); description `mt-3 max-w-2xl text-muted-foreground leading-relaxed`; photos: KEEP seluruh logic expand/lightbox & aria persis, restyle: toggle = arrow-link idiom (ImageIcon + ChevronDown rotate), thumbs `h-24 w-32 rounded-lg border border-border` snap-scroll keep, "See all" keep. PhotoLightbox keep. Entry hardcoded "Welcome, Satria..." keep apa adanya (data).

### Certificates (`components/certificate-section.tsx`)
SectionHeading index="04" label="Certificates" title={<AccentWords text="Credentials & achievements" />} description=keep copy. Empty state keep (tapi kasih SectionHeading juga).
Ledger `ul border-t border-border`; li `border-b border-border`; row (Wrapper a/div logic keep): `group flex items-center gap-5 sm:gap-8 py-6 transition-colors` + jika ada credential_url `cursor-pointer`. Isi: index mono `01` `hidden sm:block w-8 font-mono text-xs text-muted-foreground` → thumb `relative size-14 sm:size-16 shrink-0 overflow-hidden rounded-lg border border-border` (image idiom) → main `flex-1 min-w-0`: title `font-display text-base sm:text-lg font-semibold truncate transition-colors group-hover:text-primary` + featured pill `rounded-full border border-primary/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary shrink-0`; meta `mt-1 font-mono text-xs text-muted-foreground`: `{issuer} · {issued_at}` (tanpa icon) → kanan (jika credential_url): "Verify" mono xs `hidden sm:inline` + icon circle (idiom §6) berisi ArrowUpRight dengan `group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground`.

### Contact (`components/contact-section.tsx`)
SectionHeading index="05" label="Contact" title={<AccentWords text="Let's work together" />} description=keep copy Indo.
Grid `lg:grid-cols-12 gap-12 lg:gap-16`. Kiri `lg:col-span-5`: email besar `font-display text-2xl sm:text-3xl font-semibold tracking-tight underline decoration-2 decoration-primary/40 underline-offset-8 transition-colors hover:decoration-primary break-all` (mailto) → `mt-8 space-y-3` rows mono text-sm muted (Phone, MapPin — icon `size-4 text-primary`) keep nomor & lokasi → `mt-8 flex flex-wrap gap-3` social chips: `inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary` (icon size-4 + label).
Kanan `lg:col-span-7`: form TANPA card/window chrome. Fields: label `font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground` (htmlFor keep); input/textarea: `w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none`; name+email `grid sm:grid-cols-2 gap-x-10 gap-y-8`; antar field `space-y-8`. Submit: pill primary (idiom §6) + ArrowUpRight, loading state keep (Spinner). KEEP seluruh mailto logic, validasi, submitState messages.

### Footer (`components/footer.tsx`)
`border-t border-border pt-16 pb-8`. Blok 1 — wordmark raksasa: `<a href="#home">` (scrollTo keep) `block w-fit font-display font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(2.75rem,11vw,8.5rem)] text-foreground select-none` — brandLabel, bagian setelah titik terakhir `text-primary` (keep renderBrandLabel helper; tanpa logo box di wordmark). Blok 2 `mt-12 flex flex-wrap items-center justify-between gap-6`: nav QUICK_LINKS inline `flex flex-wrap gap-x-6 gap-y-2` link `text-sm text-muted-foreground hover:text-foreground` (scrollTo keep) + social icon circles (idiom §6). Blok 3 `mt-12 border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4`: kiri `© {year} ratrifa — Bandung, Indonesia` text-xs muted; kanan `font-mono text-xs text-muted-foreground` "Built with Next.js & Tailwind" + back-to-top icon circle (ArrowUp, onClick scroll window top smooth, aria-label). KEEP props social/brand. Email/phone row boleh dihapus (sudah ada di Contact).

### Project detail (`components/project-detail-*.tsx`, `commit-history-viewer.tsx`, `app/projects/[id]/page.tsx`)
Polish tipografi saja, JANGAN ubah logic/data: back link jadi pill outline kecil (ArrowLeft + "Back"), judul `font-display tracking-tight`, tech jadi chips idiom, tanggal/meta mono xs, commit viewer: panel `rounded-xl border border-border` + header mono sederhana (tanpa traffic-light dots); hover row `hover:bg-secondary/40`.

## 8. Yang TIDAK boleh berubah

- Semua `export interface` & props signature (HeroSectionContent, AboutSectionContent, Project, Experience, Certificate, props navbar/footer/contact).
- Section ids & urutan section di `home-client.tsx` (file itu tidak perlu diubah).
- Logic: fetch, mailto, lightbox, expand, scroll-spy, theme, handleDownloadCv, normalizers.
- `previewAsBanner` di Hero & About (dipakai admin preview).
- Loading screen & admin pages (di luar scope).
- Copy/teks konten existing (Indo casual) — pertahankan, ini personality.

## 9. Checklist per file

- [ ] Pakai SectionHeading + AccentWords (bukan header custom)
- [ ] Reveal pada blok utama, stagger list
- [ ] Idiom §6 untuk SEMUA interaksi
- [ ] font-display di heading, font-mono di meta
- [ ] Tidak ada `//` eyebrow, tidak ada window chrome macOS
- [ ] Light & dark mode dua-duanya legible (token semantic saja)
- [ ] `cursor-pointer` di semua clickable, aria-label di icon-only
- [ ] Kompilasi TypeScript bersih
