# ratrifastudio — Design Guide

Panduan visual untuk frontend portfolio CMS ini. Dokumen ini merangkum apa yang **sudah ada** di kode sekarang, supaya UI baru tetap konsisten dengan yang lama.

## Filosofi: "Developer Studio Minimalism"

- **Satu warna aksen** (`#5e17eb`, ungu) di atas dasar grayscale netral. Warna lain hanya dipakai fungsional (error, chart), bukan dekoratif.
- **Estetika terminal/code-editor**: section dibungkus seperti window macOS (traffic-light dots), label pakai sintaks komentar (`// career.log`), timeline pengalaman ditulis ala `git log`.
- **Tidak ada badge/tag berwarna**. Skill, kategori, metadata ditulis polos pakai monospace + separator (`·`, `/`, `→`), bukan chip/pill berwarna. Kalau butuh menonjolkan sesuatu, mainkan warna teks/ikon (`text-primary`), bukan tambah bentuk badge baru.
- **Gambar grayscale saat diam, berwarna saat hover** — efek "reveal on interaction".
- **Animasi halus dan minim**: transisi 280ms, easing custom yang sedikit "springy", page transition fade + slide-up.

Kalau ragu antara "tambah elemen visual baru" vs "perkuat lewat warna/weight/spacing yang sudah ada" — pilih yang kedua.

## Warna

Didefinisikan sebagai CSS variable (OKLch) di `app/globals.css`, otomatis switch light/dark lewat class `.dark`.

| Token | Light | Dark | Pemakaian |
|---|---|---|---|
| `--primary` / `--brand` / `--accent` / `--ring` | `#5e17eb` | `#5e17eb` | Satu-satunya warna aksen: link, fokus, highlight, hover |
| `--background` | `oklch(0.985 0.002 264)` | `oklch(0.09 0.005 264)` | Background halaman |
| `--foreground` | `oklch(0.2 0.015 264)` | `oklch(0.97 0.005 264)` | Teks utama |
| `--card` | `oklch(1 0 0)` | `oklch(0.13 0.008 264)` | Background card |
| `--secondary` / `--muted` | `oklch(0.95 0.006 264)` | `oklch(0.18 0.01 264)` | Background sekunder/muted |
| `--muted-foreground` | `oklch(0.5 0.02 264)` | `oklch(0.62 0.02 264)` | Teks sekunder/caption |
| `--border` / `--input` | `oklch(0.9 0.007 264)` | `oklch(0.22 0.01 264)` | Border, divider |
| `--destructive` | `oklch(0.62 0.22 27)` | `oklch(0.55 0.22 27)` | Error/danger |

Pakai lewat utility Tailwind: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`, `bg-primary`, dst. **Jangan hardcode hex** kecuali untuk traffic-light dots (lihat di bawah) yang memang warna tetap.

Radius dasar: `--radius: 0.5rem` (8px) → turunannya `rounded-sm/md/lg/xl`.

## Tipografi

Dua font, dipasang di `app/layout.tsx`:

- **Inter** (`--font-inter`, sans) — body text, heading, label UI. Terasa hangat & approachable.
- **Fira Code** (`--font-fira-code`, mono, kelas `font-mono`) — metadata teknis, timestamp, label section, commit hash, jendela terminal. Sinyal "developer/technical context".

Skala yang umum dipakai:

| Konteks | Class |
|---|---|
| Hero headline | `text-4xl sm:text-5xl lg:text-6xl font-bold` |
| Judul section | `text-3xl sm:text-4xl font-bold text-balance` |
| Body / deskripsi | `text-muted-foreground leading-relaxed` (umumnya `text-sm`–`text-lg`) |
| Judul card | `font-semibold text-base` / `text-sm` |
| Label kecil / metadata | `font-mono text-xs text-muted-foreground` |
| Komentar/label section ala kode | `font-mono text-xs` dengan `//` di-highlight: `<span className="text-primary">{"//"}</span>` lalu sisanya `text-muted-foreground` |

`antialiased` global di `<body>`. Heading panjang pakai `text-balance` agar wrap rapi.

## Layout & Spacing

- Container utama: `max-w-6xl mx-auto px-6`
- Padding vertikal section: `py-24` (kadang `md:py-32` untuk hero, `py-16` untuk preview/banner)
- Grid responsif mobile-first, contoh nyata:
  - Hero: `grid md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-center`
  - Projects: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
  - About: `grid md:grid-cols-[minmax(0,1fr)_320px] gap-16 items-start`
- Skala gap yang konsisten: `gap-1.5/2/2.5` (ikon+teks) → `gap-3/4` (antar field) → `gap-6/8` (dalam komponen) → `gap-12/16/20` (antar kolom besar)

## Pola Komponen

### Window/terminal chrome ("git log" aesthetic)
Dipakai di Experience, Contact form, Boot screen — section dibungkus seperti jendela editor:
```
<div className="rounded-md border border-border overflow-hidden">
  <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
    <div className="flex gap-1.5">
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </div>
    <span className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">judul-window</span>
    <span className="size-2.5" aria-hidden="true" />
  </div>
  {/* konten font-mono di dalam */}
</div>
```
Tiga dot traffic-light pakai hex tetap (`#ff5f57` / `#febc2e` / `#28c840`) — ini pengecualian dari aturan "jangan hardcode warna".

### Card
Komponen `ui/card.tsx`: `bg-card text-card-foreground rounded-xl border py-6 shadow-sm`, dengan `CardHeader/CardContent/CardFooter` ber-padding `px-6`. Project card pakai layout custom yang lebih ringan (bukan `Card`): wrapper gambar `relative w-full h-48 overflow-hidden rounded-md border border-border`, lalu konten `flex flex-col gap-2.5 pt-4`.

### Tombol (`ui/button.tsx`, berbasis CVA)
| Variant | Kapan dipakai |
|---|---|
| `default` (`bg-primary`) | Aksi utama |
| `outline` | Aksi sekunder dengan border |
| `secondary` | Aksi sekunder lebih lembut |
| `ghost` | Aksi minimal/transparan, sering dipasangkan ikon |
| `link` | Tampil seperti link |
| `destructive` | Aksi berbahaya (hapus dll) |

Size: `sm` (`h-8`), `default` (`h-9`), `lg` (`h-10`), serta `icon/icon-sm/icon-lg` untuk tombol ikon persegi.

`InteractiveHoverButton` adalah varian khusus dengan animasi dot membesar + teks slide saat hover — dipakai untuk CTA yang ingin lebih playful.

### Gambar grayscale-on-hover
Pola signature di seluruh portfolio — gambar terlihat desaturasi saat diam, berwarna penuh + sedikit scale saat di-hover:
```
className="object-cover grayscale-[40%] transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
```
Nilai grayscale bervariasi sedikit per konteks (`35–55%`), tapi pola `group-hover:grayscale-0` + `transition-all duration-300` selalu sama. Pastikan parent punya class `group`.

### Label/teks alih-alih badge
Karena badge berwarna sengaja **tidak dipakai**, untuk menonjolkan sesuatu (mis. "tipe pekerjaan", "status", "jumlah foto"):
- Naikkan kontras lewat warna teks (`text-primary`, `text-foreground/80`) dan `font-medium`/`font-semibold`
- Gunakan ikon `lucide-react` di sebelah teks untuk penguatan visual
- Pisahkan info dengan separator monospace (`·`, `/`, `[...]`, `→`) bukan dengan kotak/pill
- Hindari menambah `border` + `bg-*` + `rounded-full`/`rounded` sekaligus pada teks pendek — itu akan terlihat seperti badge lagi

## Hover, Transisi & Animasi

Aturan transisi global (`globals.css`) berlaku otomatis ke `a, button, input, textarea, select, [role=button]`:
```css
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, box-shadow;
transition-duration: 280ms;
transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
```
`prefers-reduced-motion: reduce` mematikan semua transisi ini — jangan override dengan `!important`.

Pola umum lain:
- `hover:text-primary transition-colors` untuk link/teks interaktif
- `transition-all duration-300` (kadang `duration-500`) untuk kombinasi grayscale + scale pada gambar
- Page transition (`page-transition.tsx`, pakai `motion`): fade-in + slide-up 16px, `duration: 0.45s`, `ease: easeOut`
- Animasi custom (mis. `boot-dot` di boot screen) ditulis sebagai keyframes lokal, durasi ~1.4s, staggered delay antar elemen

## Dark Mode

Berbasis class `.dark` di `<html>` (custom `ThemeProvider`, bukan `next-themes`), tersimpan di `localStorage`, fallback ke `prefers-color-scheme`. Semua token warna otomatis ikut karena didefinisikan ulang di scope `.dark` — **selalu pakai token (`bg-background`, `text-muted-foreground`, dst), jangan warna statis**, supaya komponen otomatis benar di kedua mode.

## Ikon

`lucide-react`, ukuran umum `size={11}`–`size={20}` tergantung konteks (inline dengan teks kecil → 11–14, tombol/standalone → 16–20). Sertakan `aria-label` pada tombol berisi ikon tanpa teks.

## Checklist Cepat Sebelum Nambah UI Baru

1. Apakah ini bisa dicapai dengan token warna + spacing yang sudah ada, daripada bikin style baru?
2. Apakah ini menambahkan bentuk "badge" (border + bg + rounded pada teks pendek)? Kalau ya — pertimbangkan ulang, ganti dengan penekanan warna/ikon/teks.
3. Apakah pakai `font-mono` untuk metadata/label teknis dan `font-sans` (Inter, default) untuk body/heading?
4. Apakah transisi mengikuti durasi & easing yang sudah ada (280ms, `cubic-bezier(0.16, 1, 0.3, 1)`, atau `duration-300`/`duration-500` untuk gambar)?
5. Apakah sudah dicek tampilannya di light **dan** dark mode?
