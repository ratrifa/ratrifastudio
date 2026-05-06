# 🎯 Quick Reference - RaTriFa Studio Project

## Untuk Orang Awam (Non-Technical)

**Apa sih ini project?**
Portfolio website yang bisa di-update dari dashboard admin, tanpa perlu edit kode.

**Isinya apa aja?**
- Home page → Hero section, about, projects, experience, certificates
- Project detail → Full info + GitHub commit history
- Admin panel → Manage semua content

**Siapa aja yang bisa akses?**
- **Public**: Siapa saja bisa buka ratrifa.studio
- **Admin**: Hanya ratrifa bisa login ke dashboard

**Berapa banyak project?**
- Sekarang ada 4 project active
- Bisa ditambah/diedit dari dashboard

---

## Untuk Developer (Technical Quick Facts)

**Stack:**
- Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- Backend: Next.js API Routes + Prisma ORM
- Database: MySQL via filess.io
- Hosting: Azure VM + Nginx + Let's Encrypt

**File Utama:**
```
/app/page.tsx                    → Homepage
/app/projects/[id]/page.tsx     → Project detail ⭐ NEW
/app/admin/**                    → Admin panel (protected)
/lib/github-api.ts             → GitHub integration ⭐ NEW
/prisma/schema.prisma          → Database schema
```

**Key Features:**
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Admin authentication + session management
- ✅ GitHub commit history display ⭐ NEW
- ✅ Image optimization & lazy loading
- ✅ HTTPS/SSL with Let's Encrypt
- ✅ ISR + SSR + Static generation

**API Endpoints:**
```
GET  /api/projects          → Fetch all projects
GET  /api/projects/:id      → Fetch single project
POST /api/projects          → Create project (admin)
PUT  /api/projects/:id      → Update project (admin)
DELETE /api/projects/:id    → Delete project (admin)
```

**Environment Variables:**
```
DATABASE_URL          → MySQL connection string
GITHUB_TOKEN         → GitHub API authentication
AUTH_SECRET          → JWT signing key
```

**Database Models:**
```
- User (admin)
- AdminSession
- Project
- Experience
- Certificate
- HeroSection
- AboutSection
```

**Recent Commits:**
1. Project detail page with GitHub commits
2. Fix Next.js 16 params API (Promise handling)
3. Author filter for commits (ratrifa only)

**Build Status:**
```
✅ Local dev: npm run dev
✅ Production build: npm run build (5.1s)
✅ Type checking: TypeScript 5.7.3
✅ Linting: ESLint configured
```

**Deployment:**
```
VPS: Azure Ubuntu VM (40.81.229.246)
Domain: ratrifa.studio
Process Manager: PM2 or systemd
SSL: Let's Encrypt (auto-renew)
```

---

## Development Commands

```bash
# Setup
npm install
npx prisma generate
npx prisma migrate dev

# Development
npm run dev              # http://localhost:3000
npx prisma studio       # Database GUI

# Production
npm run build
npm start

# Admin
node scripts/create-admin.mjs    # Create admin user
node scripts/db-verify.mjs       # Verify schema
```

---

## Git Workflow

**Current Branch:**
```
feature/project-detail-github-commits  (ready to merge)
    ↓
main (production)
    ↓
deploy to VPS
```

**To Deploy:**
```bash
git checkout main
git merge feature/project-detail-github-commits
npm run build
npm start
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Build Time | ~5 seconds |
| Page Load | <2 seconds |
| Database Queries | Optimized via Prisma |
| Commit History Cache | 1 hour (ISR) |
| Image Optimization | Automatic via Next.js |

---

## Security Checklist ✅

- [x] HTTPS/SSL implemented
- [x] Admin authentication + session timeout (15 min)
- [x] Login rate limiting (prevent brute force)
- [x] Password hashing (bcryptjs)
- [x] File upload validation
- [x] CSRF protection
- [x] Input validation (Zod)
- [x] Database connection pooling

---

## Common Issues & Solutions

**Issue:** Build fails with "params is a Promise"
**Solution:** Use `await params` in Next.js 16 server components

**Issue:** Commit history not showing
**Solution:** Check GITHUB_TOKEN is set in .env

**Issue:** File upload fails
**Solution:** Check folder permissions: `sudo chown -R ratrifa:ratrifa /var/www/ratrifastudio/public/uploads`

**Issue:** Database connection timeout
**Solution:** Verify connection_limit=1, pool_timeout=30 in DATABASE_URL

---

**Last Updated:** May 6, 2026  
**Maintainer:** ratrifa  
**Repository:** https://github.com/ratrifa/ratrifastudio
