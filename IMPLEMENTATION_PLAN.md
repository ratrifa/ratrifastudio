# Project Detail Feature - Implementation Plan

## 📋 Overview
Menampilkan detail lengkap project dengan GitHub commit history di halaman publik. Support private repo dengan GITHUB_TOKEN authentication.

---

## 📁 File Structure (Create New Files)

```
app/
├── projects/
│   └── [id]/
│       └── page.tsx              ← NEW: Detail route component
│
components/
├── project-detail-header.tsx     ← NEW: Header section (title, desc, meta)
├── project-detail-links.tsx      ← NEW: Demo/Repo buttons section
├── project-detail-techstack.tsx  ← NEW: Tech stack display
├── commit-history-viewer.tsx     ← NEW: Commit history container
├── commit-list.tsx               ← NEW: List of commits (scrollable)
├── commit-card.tsx               ← NEW: Individual commit display
└── loading-skeleton.tsx           ← NEW: Loading state
│
lib/
├── github-api.ts                 ← NEW: GitHub API integration
└── commit-types.ts               ← NEW: TypeScript types for commits
```

---

## 🔧 Component Breakdown

### 1. **`app/projects/[id]/page.tsx`** (Main Route)
**Purpose:** Server component yang fetch project detail dan commits
**Responsibilities:**
- Get project ID dari URL params
- Query Prisma untuk project data
- Call GitHub API untuk commits
- Pass data ke child components
- Handle error states

**Props yang diterima:**
```typescript
params: { id: string }
```

**Data yang fetched:**
- Project: title, description, image, techStack, link, githubUrl, created_at
- Commits: array dari commit history

---

### 2. **`components/project-detail-header.tsx`**
**Purpose:** Header section dengan judul dan deskripsi
**Props:**
```typescript
interface ProjectDetailHeaderProps {
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt?: Date;
}
```

**UI Elements:**
- Project image (full-width atau centered)
- Title (h1)
- Description (paragraf)
- Metadata badges (created date, last updated)

---

### 3. **`components/project-detail-links.tsx`**
**Purpose:** Action buttons untuk demo & repository
**Props:**
```typescript
interface ProjectDetailLinksProps {
  demoUrl: string;
  githubUrl: string;
  isPrivateRepo?: boolean;
}
```

**UI Elements:**
- "Live Demo" button (external link icon)
- "View Repository" button (GitHub icon)
- Badge untuk "Private Repository" jika applicable

---

### 4. **`components/project-detail-techstack.tsx`**
**Purpose:** Display tech stack dengan icons
**Props:**
```typescript
interface ProjectDetailTechstackProps {
  techStack: string[]; // Array dari tech names
}
```

**UI Elements:**
- Grid layout tech badges
- Color-coded berdasarkan tech type (frontend, backend, tools)
- Hover effects untuk tech descriptions

---

### 5. **`components/commit-history-viewer.tsx`** (Container)
**Purpose:** Main container untuk commit history section
**Props:**
```typescript
interface CommitHistoryViewerProps {
  commits: Commit[];
  isLoading?: boolean;
  error?: string;
  repoUrl: string;
  totalCommits: number;
}
```

**UI Elements:**
- Section header "Commit History"
- "View all X commits on GitHub" link
- CommitList component (dengan scroll handling)
- Loading skeleton saat fetch
- Error message fallback

---

### 6. **`components/commit-list.tsx`** (Scrollable Container)
**Purpose:** Render list commits dengan scrollable jika > 5
**Props:**
```typescript
interface CommitListProps {
  commits: Commit[];
  showAll?: boolean;
}
```

**Features:**
- Show first 5 commits by default
- Scrollable container jika commits > 5
- Smooth scrolling
- Visual indicator "Scroll untuk lihat lebih banyak"
- CSS: `max-height: 400px; overflow-y: auto;`

---

### 7. **`components/commit-card.tsx`** (Individual Item)
**Purpose:** Display single commit
**Props:**
```typescript
interface CommitCardProps {
  commit: Commit;
}
```

**UI Elements:**
- Avatar (dari commit author)
- Commit message (truncate panjang)
- Author name + email
- Timestamp (relative time: "2 days ago")
- Commit SHA (short hash, copyable)
- Direct link ke commit di GitHub

---

### 8. **`components/loading-skeleton.tsx`**
**Purpose:** Loading state untuk detail & commits
**Props:**
```typescript
interface LoadingSkeletonProps {
  type: 'detail' | 'commits';
}
```

**Features:**
- Skeleton loaders untuk setiap section
- Pulse animation
- Approximately size dengan actual content

---

## 🔌 API Integration Layer

### **`lib/github-api.ts`** (New)
**Purpose:** Centralized GitHub API calls

**Functions:**

#### 1. `fetchRepositoryCommits()`
```typescript
async function fetchRepositoryCommits(
  repoUrl: string,
  limit?: number // default 5
): Promise<Commit[]>
```
- Parse GitHub URL untuk owner/repo
- Call GitHub API dengan GITHUB_TOKEN
- Support private repos dengan authentication
- Return commit array sorted by date (newest first)
- Error handling dengan fallback

#### 2. `getGitHubAuthHeaders()`
```typescript
function getGitHubAuthHeaders(): Record<string, string>
```
- Check env variable GITHUB_TOKEN
- Return headers dengan Authorization
- Handle missing token gracefully

#### 3. `parseGitHubUrl()`
```typescript
function parseGitHubUrl(url: string): { owner: string; repo: string }
```
- Parse GitHub URL formats: https://github.com/owner/repo
- Handle trailing slashes & query params
- Throw error untuk invalid URLs

#### 4. `formatCommitData()`
```typescript
function formatCommitData(apiResponse: any): Commit
```
- Transform GitHub API response ke Commit type
- Extract: sha, message, author, date, htmlUrl
- Format timestamps

---

### **`lib/commit-types.ts`** (New)
**Purpose:** TypeScript types untuk commits

```typescript
interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  date: Date;
  htmlUrl: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    avatar_url: string;
  };
  html_url: string;
}
```

---

## 🔐 Environment Variables (Add to .env)

```env
# GitHub API Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

**How to get GITHUB_TOKEN:**
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token dengan scope: `repo` (full control of private repositories)
3. Copy token dan simpan di `.env`

---

## 🔗 Integration Points

### 1. **Modify `components/project-card.tsx`**
- Add "View Detail" link yang navigate ke `/projects/[id]`
- Example:
```tsx
<Link href={`/projects/${project.id}`}>
  <Button variant="outline">View Detail</Button>
</Link>
```

### 2. **Update `app/page.tsx`** (if needed)
- No changes needed - already fetching published projects dengan id
- Project cards akan otomatis link ke detail page

### 3. **Create `.env` Configuration**
- Add GITHUB_TOKEN ke `.env.local`
- Add ke `.env.example` dengan placeholder

---

## 📊 Data Flow

```
1. User visits /projects/[id]
   ↓
2. [id]/page.tsx server component runs
   ├─ Query Prisma untuk project data
   └─ Call fetchRepositoryCommits(githubUrl)
   ↓
3. GitHub API (dengan GITHUB_TOKEN) fetch commits
   ↓
4. Format & return Commit data
   ↓
5. Render Components:
   - ProjectDetailHeader
   - ProjectDetailLinks
   - ProjectDetailTechstack
   - CommitHistoryViewer
     └─ CommitList (scrollable)
        └─ CommitCard (individual)
   ↓
6. Display hasil ke user
```

---

## 🎨 Styling Approach

**Framework:** Tailwind CSS + shadcn/ui components
- Reuse existing components (Card, Button, Badge, Avatar)
- Custom scrollable container styling
- Responsive design (mobile-first)
- Dark mode support via existing theme provider

---

## ✅ Implementation Checklist

- [ ] Create `/app/projects/[id]/page.tsx`
- [ ] Create `lib/github-api.ts` dengan semua functions
- [ ] Create `lib/commit-types.ts` dengan TypeScript definitions
- [ ] Create `components/project-detail-header.tsx`
- [ ] Create `components/project-detail-links.tsx`
- [ ] Create `components/project-detail-techstack.tsx`
- [ ] Create `components/commit-history-viewer.tsx`
- [ ] Create `components/commit-list.tsx`
- [ ] Create `components/commit-card.tsx`
- [ ] Create `components/loading-skeleton.tsx`
- [ ] Update `components/project-card.tsx` (add "View Detail" link)
- [ ] Add GITHUB_TOKEN ke `.env.local`
- [ ] Test di local development
- [ ] Test dengan private repo
- [ ] Test responsiveness (mobile)
- [ ] Deploy ke VPS

---

## 🧪 Testing Scenarios

1. **Public Repository:** Project dengan public GitHub repo
2. **Private Repository:** Project dengan private GitHub repo (require GITHUB_TOKEN)
3. **No Repository:** Project tanpa GitHub URL
4. **Many Commits:** Repository dengan >5 commits (test scrolling)
5. **Loading State:** Artificial delay untuk test skeleton loader
6. **Error Handling:** Invalid GitHub URL, API rate limit, network error

---

## 🚀 Performance Considerations

- Fetch commits hanya ketika route accessed (not on homepage)
- Consider caching commits (e.g., 1 hour cache)
- Paginate commits jika terlalu banyak
- Use Next.js Image component untuk optimization
- Lazy load commit history jika ada banyak

---

## 📝 Next Steps

1. **Review Plan:** Approve structure & components
2. **Create Files:** Implement satu per satu
3. **Test:** Verify setiap component works
4. **Deploy:** Push ke GitHub & test di VPS
5. **Iterate:** Refinements berdasarkan feedback
