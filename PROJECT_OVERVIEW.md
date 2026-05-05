# 📚 RaTriFa Studio - Project Documentation

**Version:** 1.0 | **Last Updated:** May 6, 2026 | **Status:** Production Ready ✅

---

## 🎯 Deskripsi Singkat (ELI5 - Explain Like I'm 5)

**RaTriFa Studio** adalah sebuah **website portfolio interaktif pribadi** - seperti **resume digital yang hidup** 🌐

Bayangkan Anda memiliki:
- 📄 **Dokumen resume** yang biasa (membosankan)
- vs
- 💻 **Website portfolio** yang bisa berubah-ubah, berkembang, dan menampilkan karya-karya real-time

Sistem ini memiliki dua bagian:

1. **🌍 Website Publik (ratrifa.studio)**
   - Orang lain bisa lihat profile, project, experience, sertifikat
   - Seperti toko online tapi untuk menampilkan skills & karya

2. **🔐 Admin Panel (ratrifa.studio/admin)**
   - Hanya owner (ratrifa) yang bisa login
   - Dashboard untuk manage/edit semua konten
   - Seperti "remote control" untuk website

---

## 👨‍💼 Deskripsi untuk Non-Technical Users

### Apa Itu RaTriFa Studio?

RaTriFa Studio adalah **Content Management System (CMS) portfolio pribadi** yang memungkinkan siapa saja untuk:

- ✨ Membuat **website portfolio profesional** tanpa coding
- 📝 **Mengelola konten** (projects, experience, certificates) dengan mudah
- 🎨 **Tampilan modern** dengan dark mode dan responsive design
- 🔒 **Secure** dengan login authentication

### Fitur Utama dari Perspektif Pengguna

#### 1. **Hero Section (Landing Page)**
- Headline/Bio pribadi yang eye-catching
- Logo domain yang bisa diupload
- Avatar pengguna
- Badge status (Open to work, etc)
- Social media links (GitHub, LinkedIn, Twitter)

#### 2. **Project Showcase**
- Grid layout menampilkan semua project
- Info per project: gambar, title, deskripsi, tech stack
- Tombol "View Details" untuk melihat detail lengkap
- Demo & Repository links untuk tiap project

#### 3. **Project Detail View** ⭐ NEW
- Page khusus untuk tiap project
- Full project description & metadata
- **Commit history** dari GitHub repo
- Menampilkan siapa yang contribute & kapan
- Scrollable commit list untuk project besar

#### 4. **Experience Timeline**
- Riwayat pekerjaan / pengalaman
- Periode waktu (Start - End)
- Peran dan institusi
- Deskripsi aktivitas/pencapaian

#### 5. **Certificate Gallery**
- Showcase sertifikasi / penghargaan
- Bisa upload gambar sertifikat
- Link ke credential (jika ada)
- Featured badge untuk highlight tertentu

#### 6. **Admin Panel Dashboard**
- Overview jumlah projects, experiences, certificates
- CRUD interface untuk manage konten
- Upload gambar terintegrasi
- Form validation & error handling
- Session management & security

---

## 👨‍💻 Deskripsi untuk Developer / Technical Teams

### 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                │
├─────────────────────────────────────────────────────────┤
│  Next.js 16.2.0 (App Router) + React 19                 │
│  - Server Components untuk SSR                          │
│  - Client Components untuk interactivity                │
│  - Image Optimization & Static Generation               │
├─────────────────────────────────────────────────────────┤
│                   MIDDLEWARE LAYER                       │
│  - Authentication & Authorization                       │
│  - Session Management                                   │
│  - Admin Route Protection                               │
├─────────────────────────────────────────────────────────┤
│                   API LAYER (API Routes)                │
│  - /api/projects - CRUD projects                        │
│  - /api/experiences - CRUD experiences                  │
│  - /api/certificates - CRUD certificates               │
│  - /api/health - Health check endpoint                  │
├─────────────────────────────────────────────────────────┤
│                DATABASE LAYER                            │
│  - Prisma ORM (MySQL via filess.io)                     │
│  - Connection pooling & timeout handling                │
│  - Automated migrations                                 │
├─────────────────────────────────────────────────────────┤
│              EXTERNAL SERVICES                           │
│  - GitHub API (Commit history fetching)                 │
│  - File Storage (Local filesystem)                      │
│  - Let's Encrypt SSL/TLS                                │
└─────────────────────────────────────────────────────────┘
```

### 2. Tech Stack Deep Dive

**Frontend:**
- **Next.js 16.2.0** - React framework dengan server-side rendering, API routes, image optimization
- **React 19** - UI library dengan new features (use() hook, React Compiler support)
- **TypeScript 5.7.3** - Type safety untuk semua files
- **Tailwind CSS 4.2.0** - Utility-first CSS framework
- **shadcn/ui** - Unstyled, accessible component library
- **date-fns** - Date manipulation & formatting
- **Zod** - TypeScript-first schema validation
- **React Hook Form** - Efficient form state management

**Backend:**
- **Next.js API Routes** - Serverless functions untuk CRUD operations
- **Prisma 6.19.3** - ORM untuk database operations
- **MySQL** - Database via filess.io (connection_limit=1, pool_timeout=30)
- **bcryptjs** - Password hashing untuk admin authentication
- **jose** - JWT token generation & validation

**DevOps & Infrastructure:**
- **Azure VM** - Cloud hosting (Ubuntu, 40.81.229.246)
- **Nginx 1.24.0** - Reverse proxy, SSL termination
- **Let's Encrypt** - Free SSL/TLS certificates (auto-renewal via Certbot)
- **PM2 or systemd** - Process manager / service handler
- **GitHub** - Version control & commit history fetching

### 3. Database Schema (Prisma Models)

```prisma
// User & Authentication
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   (bcrypted)
  role      UserRole @default(ADMIN)
  sessions  AdminSession[]
}

model AdminSession {
  id        String    @id @default(uuid())
  userId    String
  expiresAt DateTime
  revokedAt DateTime?
}

// Main Content Models
model Project {
  id          String   @id @default(uuid())
  title       String
  description String   @db.Text
  techStack   Json     // ["Next.js", "React", "TypeScript"]
  imageUrl    String?
  link        String?  // Demo URL
  githubUrl   String?  // GitHub repo URL
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Experience {
  id             String    @id @default(uuid())
  title          String
  company        String
  experienceType ExperienceType?
  periodStart    DateTime
  periodEnd      DateTime?
  description    String    @db.Text
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Certificate {
  id            String   @id @default(uuid())
  title         String
  issuer        String
  imageUrl      String?
  issueDate     DateTime
  credentialUrl String?
  featured      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Hero & About Sections
model HeroSection {
  id                String   @id
  headline          String
  description       String   @db.Text
  domainLogoUrl     String?
  domainLabel       String
  name              String
  role              String
  techTags          Json
  cvUrl             String
  avatarUrl         String?
  githubUrl         String?
  linkedinUrl       String?
  twitterUrl        String?
  statusBadgeDetail String
  openToWork        Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model AboutSection {
  id        String   @id
  headline  String
  paragraph String   @db.Text
  stats     Json     // { "projectsCount": 10, "yearsExp": 3 }
  skills    Json     // ["JavaScript", "React", "TypeScript"]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4. File Structure

```
ratrifastudio/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with metadata generation
│   ├── page.tsx                 # Homepage (force-dynamic)
│   ├── api/                     # API routes
│   │   ├── projects/
│   │   ├── experiences/
│   │   ├── certificates/
│   │   └── health/
│   ├── admin/                   # Protected admin routes
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard
│   │   ├── projects/
│   │   ├── experiences/
│   │   └── certificates/
│   ├── projects/
│   │   └── [id]/               # Dynamic project detail route ⭐ NEW
│   │       └── page.tsx
│   └── backdoor-entry/         # Admin login page
│
├── components/                   # React components
│   ├── hero-section.tsx
│   ├── project-card.tsx         # Project grid card
│   ├── project-detail-*.tsx     # ⭐ NEW detail page components
│   ├── commit-*.tsx             # ⭐ NEW commit history components
│   ├── loading-skeleton.tsx     # ⭐ NEW skeleton loaders
│   ├── admin/                   # Admin panel components
│   └── ui/                      # shadcn/ui components
│
├── lib/                          # Utility functions
│   ├── github-api.ts            # ⭐ NEW GitHub API integration
│   ├── commit-types.ts          # ⭐ NEW TypeScript types
│   ├── auth.ts                  # Authentication logic
│   ├── storage.ts               # File upload handling
│   ├── prisma.ts                # Prisma singleton
│   ├── validation.ts            # Zod schemas
│   └── utils.ts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migration history
│
├── public/
│   ├── images/
│   └── uploads/                 # File storage for uploads
│
├── scripts/
│   ├── create-admin.mjs
│   ├── backfill-experience-type.mjs
│   └── db-verify.mjs
│
├── .env.example                 # Environment template
├── .env.local                   # Local environment (gitignored)
├── package.json                 # Dependencies
├── next.config.mjs              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
└── IMPLEMENTATION_PLAN.md      # Project detail feature planning
```

### 5. Key Features & Implementation

#### A. **Homepage (/)** - Server Component
```
Features:
- Force-dynamic rendering (always fresh data)
- Fetch all published projects from database
- Map to Project interface for display
- Server-side rendering + incremental static regeneration
```

#### B. **Admin Panel (/admin)** - Protected Routes
```
Security:
- Session-based authentication
- 15-minute session timeout
- Login rate limiting (prevent brute force)
- CSRF protection via cookies

Features:
- Dashboard overview
- CRUD interface untuk semua content models
- Image upload dengan validation
- Form state management via React Hook Form
- Success/error notifications
```

#### C. **Project Detail Page (/projects/[id])** ⭐ NEW
```
Architecture:
- Server component dengan async/await
- Dynamic route dengan params as Promise (Next.js 16 API)
- SSR dengan metadata generation

Functionality:
1. Fetch project from Prisma
2. Fetch GitHub commits via API (filterAuthor: "ratrifa")
3. Parse techStack JSON array
4. Render components:
   - ProjectDetailHeader (image, title, description)
   - ProjectDetailLinks (demo, repo buttons)
   - ProjectDetailTechstack (tech badges)
   - CommitHistoryViewer (scrollable commit list)

Performance:
- ISR revalidation: 3600 seconds (GitHub API cache)
- Image optimization via Next Image
- Skeleton loading states
```

#### D. **GitHub Commit History Integration** ⭐ NEW
```
Implementation:
- GitHub REST API v3: /repos/{owner}/{repo}/commits
- Support private repos with GITHUB_TOKEN authentication
- Filter commits by author login (only "ratrifa")
- Relative time formatting (2d ago, 3mo ago, etc)
- Copy-to-clipboard commit SHA
- Direct GitHub commit links

Error Handling:
- 404: Repository not found
- 403: API rate limit exceeded
- 401: Authentication failed
- Network errors dengan fallback message

Performance:
- Fetch 100 commits, filter in-memory
- Cache response untuk 1 jam
- No N+1 queries
```

### 6. Security Architecture

**Authentication Layer:**
```
1. Login Flow:
   - POST /api/login dengan email & password
   - Password di-hash dengan bcryptjs
   - Generate JWT token & store di HTTP-only cookie
   - Session expiry: 15 minutes

2. Authorization:
   - Middleware check session validity
   - Protect /admin routes
   - Check user role (ADMIN)
   - Rate limiting untuk login attempts

3. Admin Route Protection:
   - Dynamic import dari useAuth() hook
   - Redirect ke login jika session invalid
   - Session revocation support
```

**File Upload Security:**
```
- MIME type validation (PNG, JPG, WEBP for images)
- File size limits (2MB for images, 5MB for documents)
- UUID-based naming untuk prevent filename conflicts
- Stored in /var/www/ratrifastudio/public/uploads/
- Ownership: ratrifa:ratrifa (755 permissions)
```

**API Security:**
```
- CORS headers management
- Input validation dengan Zod
- SQL injection prevention (Prisma ORM)
- Rate limiting considerations
- Error message sanitization
```

### 7. Deployment & Infrastructure

**VPS Setup:**
```
- Azure VM: Ubuntu 20.04 LTS
- IP: 40.81.229.246
- Domain: ratrifa.studio (A record pointing to VM)

Server Stack:
- Nginx 1.24.0 (reverse proxy on 80/443)
- Let's Encrypt SSL (auto-renewal via Certbot)
- Node.js 18+ (Next.js runtime)
- MySQL 5.7 (filess.io)
- PM2 or systemd (process manager)
```

**SSL/TLS:**
```
- Certificate: ratrifa.studio (Let's Encrypt)
- Valid until: 2026-08-03
- Auto-renewal: Enabled via Certbot
- HTTP → HTTPS redirect: Automatic
```

**File Structure (VPS):**
```
/var/www/ratrifastudio/
├── .env                  # Production environment
├── .next/               # Built Next.js output
├── node_modules/
├── public/
│   ├── images/
│   └── uploads/         # User-uploaded files
├── package.json
└── npm start            # Start production server
```

### 8. Development Workflow

**Local Development:**
```bash
# Setup
npm install
npx prisma generate
npx prisma migrate dev   # Sync database

# Development server
npm run dev              # Port 3000

# Database exploration
npx prisma studio       # GUI database explorer
node scripts/db-verify.mjs  # Verify schema
```

**Production Build:**
```bash
# Build optimization
npm run build            # Outputs to .next/

# Production server
npm start               # Starts on port 3000
                       # Nginx proxies 80/443 → 3000
```

**Git Workflow:**
```
- feature/project-detail-github-commits (in development)
- main (production ready)
- Pull requests for code review
- Merge to main after testing
```

### 9. Performance Considerations

**Frontend Optimization:**
- Image optimization (next/image)
- Code splitting (dynamic imports)
- CSS minification (Tailwind)
- JS tree-shaking

**Backend Optimization:**
- Database connection pooling
- ISR (Incremental Static Regeneration) 3600s
- API response caching
- Query optimization via Prisma

**Network Optimization:**
- Gzip compression via Nginx
- HTTP/2 support
- CDN-ready (if needed)
- Lazy loading for components

### 10. Monitoring & Logging

**Current Implementation:**
- Vercel Analytics (integrated)
- Prisma logging (development only)
- Console error catching

**Recommendation for Production:**
- Error tracking (Sentry, Rollbar)
- APM monitoring (New Relic, Datadog)
- Database slow query logging
- Nginx access logs

---

## 🔄 Recent Updates (May 2026)

### ✅ Implemented
1. **HTTPS/SSL Setup** - Let's Encrypt certificate installed & auto-renewal configured
2. **File Upload Fix** - Permission issue resolved (ratrifa:ratrifa ownership)
3. **Favicon Optimization** - Dynamic favicon from admin-uploaded domain logo
4. **Project Detail Pages** ⭐ NEW - Dynamic routes `/projects/[id]`
5. **GitHub Commit History** ⭐ NEW - Integration with GitHub API
6. **Author Filtering** ⭐ NEW - Display commits from "ratrifa" only

### 🚀 Deployment Status
- ✅ Local development: Working
- ✅ Build: Successful (Next.js 16 Turbopack)
- ✅ VPS: Ready to deploy feature/project-detail-github-commits branch
- ⏳ Production: Awaiting merge to main

---

## 📊 Technology Comparison

| Aspek | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 16 | SSR, SEO, image optimization, API routes |
| UI Library | shadcn/ui | Unstyled, accessible, customizable |
| Styling | Tailwind CSS | Utility-first, production-ready, DX excellent |
| Database | MySQL (filess.io) | Reliable, managed hosting, affordable |
| ORM | Prisma | Type-safe, developer experience, migrations |
| Auth | JWT + Session | Stateless yet manageable, CSRF protection |
| Deployment | Azure VM + Nginx | Control, flexibility, proven stack |

---

## 🎓 Learning Resources & Best Practices

**This Project Demonstrates:**
- ✅ Full-stack Next.js application architecture
- ✅ Server vs Client components in React 19
- ✅ Database schema design with Prisma
- ✅ Authentication & authorization patterns
- ✅ File upload handling & validation
- ✅ External API integration (GitHub)
- ✅ Environment configuration management
- ✅ SSL/TLS & security best practices
- ✅ Git workflow & version control

---

## 📞 Support & Questions

**For Developers:**
- Check [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for project detail feature spec
- Review Prisma schema in `prisma/schema.prisma`
- Check environment template in `.env.example`

**For Deployment:**
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- See [AZURE_VPS_SETUP.md](AZURE_VPS_SETUP.md)

---

**End of Documentation** | Generated on May 6, 2026
