# Sindhur Exports — Official Website & Admin Platform

Full-stack marketing website and admin panel for **Sindhur Exports**, a Visakhapatnam-based Indian B2B export company. Built with Next.js 16 App Router, React 19, MongoDB Atlas, and Tailwind CSS v4.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Route Map](#route-map)
- [Data Models & Interfaces](#data-models--interfaces)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Admin Panel](#admin-panel)
- [Blog System](#blog-system)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Business Information](#business-information)

---

## Overview

The platform has two audiences:

**Public** — International buyers browse products, global reach, export process, and submit quote requests via the contact form. A `/blog` section provides SEO-rich trade insight articles.

**Admin** — Staff log in at `/login`, manage quote requests at `/admin/quotes`, and write/publish blog articles at `/admin/blog`. All admin routes are protected by JWT middleware at the Edge layer.

---

## Tech Stack

| Concern | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | ^16.2.6 |
| UI | React | 19.2.3 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| CSS processing | @tailwindcss/postcss | ^4 |
| Database | MongoDB Atlas via Mongoose | ^9.7.0 |
| Password hashing | bcryptjs | ^3.0.3 |
| JWT (API routes) | jsonwebtoken | ^9.0.3 |
| JWT (middleware/Edge) | jose | ^6.2.3 |
| Icons (admin UI) | lucide-react | ^1.18.0 |
| Markdown parsing | marked | ^18.0.5 |
| Toast notifications | react-hot-toast | ^2.6.0 |
| Fonts | Google Fonts via next/font | — |

**Dev dependencies:** `@types/bcryptjs`, `@types/jsonwebtoken`, `@types/marked`, `eslint`, `eslint-config-next`

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster with the `syndhur-exports` database (already configured in `.env.local`)

### Install & run

```bash
cd Sindhur
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
Sindhur/
│
├── app/
│   ├── (auth)/                         # Route group — no marketing Navbar
│   │   ├── layout.tsx                  # Minimal bg-gray-50 wrapper
│   │   ├── login/page.tsx              # Admin login form
│   │   └── register/page.tsx           # Admin registration form
│   │
│   ├── admin/                          # JWT-protected panel (middleware guards entry)
│   │   ├── layout.tsx                  # Sidebar layout + client-side auth guard
│   │   ├── page.tsx                    # Dashboard: stat cards + recent quotes
│   │   ├── quotes/page.tsx             # Quote request manager
│   │   └── blog/
│   │       ├── page.tsx                # Blog post list
│   │       ├── new/page.tsx            # Create post form
│   │       └── [id]/edit/page.tsx      # Edit post form (finds post by MongoDB _id)
│   │
│   ├── api/v1/
│   │   ├── utils/
│   │   │   ├── responses.tsx           # success<T>() / failure<E>() typed helpers
│   │   │   └── verifyToken.tsx         # Reads "token" cookie; jsonwebtoken.verify()
│   │   ├── auth/
│   │   │   ├── login/route.tsx         # POST: bcrypt compare → set httpOnly cookie
│   │   │   ├── register/route.tsx      # POST: bcrypt hash → create User doc
│   │   │   ├── logout/route.tsx        # POST: clear "token" cookie (maxAge: 0)
│   │   │   └── me/route.tsx            # GET (JWT): return user sans passwordHash
│   │   ├── quotes/
│   │   │   ├── route.tsx               # POST (public): create; GET (JWT): list paginated
│   │   │   └── [id]/route.tsx          # PATCH (JWT): status/notes; DELETE (JWT)
│   │   ├── blog/
│   │   │   ├── route.tsx               # GET (public/JWT): list; POST (JWT): create
│   │   │   └── [slug]/route.tsx        # GET (public): single; PATCH/DELETE (JWT)
│   │   └── admin/
│   │       └── stats/route.tsx         # GET (JWT): aggregated counts + 5 recent quotes
│   │
│   ├── blog/
│   │   ├── page.tsx                    # Server Component: published post grid
│   │   └── [slug]/page.tsx             # Server Component: full post + generateMetadata
│   │
│   ├── layout.tsx                      # Root: fonts, UserProvider, Toaster
│   ├── page.tsx                        # Homepage: all marketing sections + SEO metadata
│   └── globals.css                     # Tailwind v4 import + @theme {} color tokens
│
├── components/                         # Marketing section components
│   ├── Navbar.tsx                      # Client: scroll-aware, mobile hamburger, Blog + Admin links
│   ├── HeroSection.tsx                 # Client: parallax scroll via useRef
│   ├── AboutSection.tsx                # Server: story, certifications, image collage
│   ├── ProductsSection.tsx             # Server: 6-card product grid
│   ├── GlobalSection.tsx               # Server: countries grouped by region
│   ├── WhyChooseSection.tsx            # Server: sticky left panel + 2-col card grid
│   ├── ProcessSection.tsx              # Server: 5-step horizontal timeline
│   ├── TestimonialsSection.tsx         # Server: 3 testimonial cards + brand strip
│   ├── ContactSection.tsx              # Client: form → POST /api/v1/quotes (real API)
│   └── Footer.tsx                      # Server: links, real contact info, social icons
│
├── shared/
│   ├── context/
│   │   └── UserContext.tsx             # useUser() hook; localStorage key: "se_user"
│   ├── interfaces/mongodb/
│   │   ├── users/user.tsx              # IUser, UserRole
│   │   ├── quotes/quoteRequest.tsx     # IQuoteRequest, QuoteStatus
│   │   └── blog/blogPost.tsx           # IBlogPost, PostStatus
│   ├── lib/
│   │   ├── db/mongo.tsx                # mongoDB() singleton (globalThis._mongoCache)
│   │   └── utils.tsx                   # cx(), slugify(), formatDate()
│   └── models/mongodb/
│       ├── users/user.tsx              # Mongoose User model
│       ├── quotes/quoteRequest.tsx     # Mongoose QuoteRequest model
│       └── blog/blogPost.tsx           # Mongoose BlogPost model
│
├── lib/
│   └── data.ts                         # All static marketing content (exported constants)
├── types/
│   └── index.ts                        # TypeScript types for marketing data shapes
│
├── middleware.ts                        # Edge: jose jwtVerify → protects /admin/:path*
├── next.config.ts                       # serverExternalPackages, image remotePatterns
├── tsconfig.json                        # strict, @/* alias → project root
├── postcss.config.mjs                   # @tailwindcss/postcss plugin
└── .env.local                           # Secrets — never commit
```

---

## Route Map

### Public Routes

| Path | Type | Description |
|---|---|---|
| `/` | Static (SSG) | Homepage — all marketing sections |
| `/blog` | Dynamic (SSR) | Published blog post grid |
| `/blog/[slug]` | Dynamic (SSR) | Individual post with full SEO metadata |
| `/login` | Static | Admin login form |
| `/register` | Static | Admin registration form |

### Admin Routes — protected by `middleware.ts`

| Path | Description |
|---|---|
| `/admin` | Dashboard — stats cards + 5 most recent inquiries |
| `/admin/quotes` | Quote request list, status management, admin notes |
| `/admin/blog` | Blog post list — publish/unpublish, delete |
| `/admin/blog/new` | Create new article |
| `/admin/blog/[id]/edit` | Edit existing article (routed by MongoDB `_id`) |

### API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | — | Login; sets `token` httpOnly cookie |
| `POST` | `/api/v1/auth/register` | — | Create admin account |
| `POST` | `/api/v1/auth/logout` | — | Clears `token` cookie (`maxAge: 0`) |
| `GET` | `/api/v1/auth/me` | JWT cookie | Return current user (no `passwordHash`) |
| `POST` | `/api/v1/quotes` | — | Submit quote request from public form |
| `GET` | `/api/v1/quotes` | JWT cookie | List quote requests, paginated |
| `PATCH` | `/api/v1/quotes/[id]` | JWT cookie | Update `status` and/or `adminNotes` |
| `DELETE` | `/api/v1/quotes/[id]` | JWT cookie | Delete a quote request |
| `GET` | `/api/v1/blog` | — / JWT | List posts; `?admin=true` requires JWT, returns all statuses |
| `POST` | `/api/v1/blog` | JWT cookie | Create blog post |
| `GET` | `/api/v1/blog/[slug]` | — / JWT | Single post; `?admin=true` skips published filter |
| `PATCH` | `/api/v1/blog/[slug]` | JWT cookie | Update post fields |
| `DELETE` | `/api/v1/blog/[slug]` | JWT cookie | Delete post by slug |
| `GET` | `/api/v1/admin/stats` | JWT cookie | Aggregated counts + 5 most recent quotes |

---

## Data Models & Interfaces

### `IUser` — `shared/interfaces/mongodb/users/user.tsx`

```ts
export type UserRole = "Admin";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Mongoose schema** (`shared/models/mongodb/users/user.tsx`):
- `email`: unique index, lowercase, trimmed
- `role`: enum `["Admin"]`, default `"Admin"`
- `timestamps: true`

---

### `IQuoteRequest` — `shared/interfaces/mongodb/quotes/quoteRequest.tsx`

```ts
export type QuoteStatus = "pending" | "reviewing" | "responded" | "closed";

export interface IQuoteRequest {
  _id?: string;
  name: string;
  company?: string;
  email: string;
  country?: string;
  product?: string;
  message?: string;
  status: QuoteStatus;        // default: "pending"
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Mongoose schema** indexes: `status` (single), `{ createdAt: -1 }`, `{ status: 1, createdAt: -1 }`

---

### `IBlogPost` — `shared/interfaces/mongodb/blog/blogPost.tsx`

```ts
export type PostStatus = "draft" | "published";

export interface IBlogPost {
  _id?: string;
  title: string;
  slug: string;           // unique, URL-safe, lowercase
  excerpt: string;        // used as meta description (aim for ≤160 chars)
  content: string;        // raw HTML — rendered via dangerouslySetInnerHTML
  coverImage?: string;    // URL (Unsplash or other CDN)
  tags: string[];
  status: PostStatus;     // default: "draft"
  authorId?: string;      // JWT sub from creating admin
  publishedAt?: Date;     // set automatically when status becomes "published"
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Mongoose schema** indexes: `slug` (unique), `status` (single), `{ status: 1, publishedAt: -1 }`

---

### Marketing types — `types/index.ts`

`Product`, `Testimonial`, `ProcessStep`, `WhyChooseItem`, `Country`, `NavLink` — used only in `lib/data.ts` and the static marketing components. Not stored in MongoDB.

---

## API Reference

### Standard response envelope

Every API response uses the same shape:

```jsonc
// Success
{ "success": true, "message": "...", "data": <payload> }

// Failure
{ "success": false, "message": "...", "error": "..." }  // error omitted in production
```

### Paginated list shape (inside `data`)

```jsonc
{
  "items": [],
  "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```

### Query parameters

**Quotes list** `GET /api/v1/quotes`
- `?status=pending|reviewing|responded|closed` — filter by status
- `?page=1&limit=20` — pagination

**Blog list** `GET /api/v1/blog`
- `?admin=true` — bypass published filter (requires JWT cookie)
- `?tag=spices` — filter by tag
- `?page=1&limit=12` — pagination
- Note: `content` field is excluded from list responses (`-content` projection) in both public and admin modes

**Blog single post** `GET /api/v1/blog/[slug]`
- `?admin=true` — allows fetching draft posts (requires JWT cookie)

### Blog creation — slug rules

1. `slug` is auto-generated via `slugify(title)` if not provided
2. If the generated slug already exists in the DB, `Date.now()` is appended: `my-slug-1234567890`
3. `publishedAt` is set to `new Date()` automatically when `status === "published"` at creation or update

---

## Design System

### Tailwind v4 setup

`app/globals.css` uses `@import "tailwindcss"` (v4 syntax — not `@tailwind base/components/utilities`). Custom tokens live in two blocks:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);       /* DM Sans, set by next/font on <html> */
  --font-display: var(--font-display); /* Playfair Display, set by next/font on <html> */
}

@theme {
  /* -- Brand -- */
  --color-primary: #f97316;
  --color-primary-hover: #ea580c;
  --color-primary-foreground: #ffffff;
  --color-primary-subtle: #fff7ed;

  /* -- Surfaces -- */
  --color-surface: #f9fafb;
  --color-surface-card: #ffffff;
  --color-dark: #030712;

  /* -- Text -- */
  --color-foreground-heading: #111827;
  --color-foreground-body: #4b5563;
  --color-foreground-muted: #9ca3af;

  /* -- Borders -- */
  --color-border: #f3f4f6;
  --color-border-input: #e5e7eb;
  --color-border-focus: #fb923c;

  /* -- Status -- */
  --color-status-warning: #b45309;        --color-status-warning-surface: #fffbeb;
  --color-status-info: #1d4ed8;           --color-status-info-surface: #eff6ff;
  --color-status-success: #15803d;        --color-status-success-surface: #f0fdf4;
  --color-status-danger: #b91c1c;         --color-status-danger-surface: #fef2f2;
}
```

### Fonts

Configured in `app/layout.tsx` with `next/font/google`:

```ts
const dmSans    = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["300","400","500","600","700","800","900"] });
const playfair  = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["700","800","900"] });
// Applied as className on <html>
```

### Status badge pattern (admin UI)

```ts
const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  reviewing: "bg-blue-50 text-blue-700 border border-blue-200",
  responded: "bg-green-50 text-green-700 border border-green-200",
  closed:    "bg-gray-100 text-gray-600 border border-gray-200",
};
```

### Reusable form input class (admin / auth pages)

```ts
const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 " +
  "focus:border-orange-400 transition";
```

### Marketing section background alternation

Sections alternate to create visual rhythm without dividers:

| Section | Background |
|---|---|
| Hero | `bg-gray-950` (dark) |
| About | `bg-white` |
| Products | `bg-gray-50` |
| Global Reach | `bg-gray-950` (dark) |
| Why Choose | `bg-white` |
| Process | `bg-gray-50` |
| Testimonials | `bg-white` |
| Contact | `bg-gray-50` |
| Footer | `bg-gray-950` (dark) |

---

## Admin Panel

### First-time setup

1. Visit `/register` to create your admin account (password min. 8 chars)
2. Log in at `/login`
3. You are redirected to `/admin` on success

### Route protection (two layers)

1. **Edge middleware** (`middleware.ts`): `jose`'s `jwtVerify` runs on every `/admin/*` request before any page renders. Invalid or missing token → redirect to `/login?from=<original-path>`.
2. **Client guard** (`admin/layout.tsx`): `useUser()` in a `useEffect` — if `!loading && !user`, redirect to `/login`. This is a fallback for CSR transitions.

### Sidebar navigation

Desktop: fixed `w-60` white sidebar. Mobile: slide-in overlay triggered by hamburger.

Nav items (lucide-react icons):
- **Dashboard** (`LayoutDashboard`) → `/admin`
- **Quote Requests** (`MessageSquare`) → `/admin/quotes`
- **Blog Posts** (`FileText`) → `/admin/blog`
- **View Website** (`Globe`) → `/` (opens in new tab)
- User avatar + name + email + logout button (`LogOut`)

### Dashboard stats

Fetches `GET /api/v1/admin/stats` which returns in a single round-trip:
- `quotes.total`, `quotes.pending`, `quotes.reviewing`
- `blog.total`, `blog.published`, `blog.drafts`
- `recentQuotes` — last 5 quote requests (full documents)

### Quote request management

- Filter tabs: All / Pending / Reviewing / Responded / Closed
- Each row is expandable (accordion): shows full details, email link, country, product, message
- Inline status `<select>` — change triggers immediate `PATCH`
- Admin notes text input — saved with a "Save" button
- Delete button with `window.confirm()`

### Blog post management

- Filter tabs: all / published / draft
- Each row shows cover image thumbnail (or placeholder icon), title, date, tags (first 2), status badge
- **Publish / Unpublish** toggle — one-click `PATCH` to flip status
- **Edit** button → `/admin/blog/[_id]/edit`
- **View live** icon (Globe) — only shown when published, opens `/blog/[slug]` in new tab
- **Delete** button with `window.confirm()`

---

## Blog System

### Writing content

Content is stored and rendered as **HTML**. The editor textarea accepts standard HTML:

```html
<h2>Section Title</h2>
<p>Paragraph with <strong>bold</strong>, <em>italics</em> and <a href="#">links</a>.</p>
<ul><li>List item</li></ul>
<blockquote>A notable quote.</blockquote>
```

A **Preview** toggle renders the content via `dangerouslySetInnerHTML` with Tailwind's `prose` typography classes applied.

### Slug generation

`slugify(text)` in `shared/lib/utils.tsx`:
```ts
text.toLowerCase().trim()
  .replace(/[^\w\s-]/g, "")
  .replace(/[\s_-]+/g, "-")
  .replace(/^-+|-+$/g, "")
```

Auto-fills from the title as you type on the new post form. Can be manually overridden.

### SEO per post (`/blog/[slug]`)

`generateMetadata()` is a Next.js Server Function that runs at request time:

```ts
{
  title: `${post.title} — Sindhur Exports Blog`,
  description: post.excerpt,
  keywords: post.tags,
  openGraph: {
    title: post.title,
    description: post.excerpt,
    type: "article",
    publishedTime: post.publishedAt,
    images: post.coverImage ? [{ url: post.coverImage }] : [],
  }
}
```

---

## Authentication

### Flow

```
1. POST /api/v1/auth/login
   → bcrypt.compare(password, user.passwordHash)
   → jwt.sign({ sub: user._id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
   → Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=JWT_COOKIE_MAX_AGE

2. Subsequent admin requests
   → middleware.ts reads cookie "token"
   → jose.jwtVerify(token, secret)   ← Edge Runtime compatible
   → API routes: verifyToken(req) uses jsonwebtoken.verify()  ← Node.js runtime

3. POST /api/v1/auth/logout
   → Set-Cookie: token=; Max-Age=0 (clears cookie)
```

### UserContext (`shared/context/UserContext.tsx`)

- Exports: `ILoggedinUser`, `UserProvider`, `useUser()`
- `ILoggedinUser`: `{ id, name?, email, role? }`
- localStorage key: `"se_user"` (JSON-serialised `ILoggedinUser`)
- On mount: if no user in state, calls `GET /api/v1/auth/me` to rehydrate from cookie
- `login(u)`: sets state + localStorage
- `logout()`: clears state + localStorage + calls `POST /api/v1/auth/logout`

### Two JWT libraries — why both

| Context | Library | Reason |
|---|---|---|
| `middleware.ts` | `jose` | Runs on Edge Runtime (V8 isolate) — no Node.js crypto module |
| API route handlers | `jsonwebtoken` | Runs in Node.js runtime — has access to native crypto |

---

## Environment Variables

All configured in `.env.local`:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas URI; database name: `syndhur-exports` |
| `JWT_SECRET` | HMAC secret for signing/verifying JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `JWT_COOKIE_MAX_AGE` | Cookie `maxAge` in seconds (e.g. `604800` = 7 days) |
| `BCRYPT_SALT_ROUNDS` | Bcrypt work factor (e.g. `12`) |
| `NEXT_PUBLIC_APP_URL` | Add this with your deployed URL for server-side blog fetches in production |
| `BREVO_*` | Email credentials (Brevo SMTP) — wired up when email notifications are added |
| `NEXT_PUBLIC_SUPABASE_*` | Supabase project — wired up when image upload is added |
| `OPENAI_API_KEY` | Available for future AI features |
| `REDIS_URL` / `UPSTASH_*` | Redis credentials — available for future rate limiting or caching |

> Before going live, update `EMAIL_FROM` in `.env.local` from `FR3SH <hello@farmers-republic.com>` to `Sindhur Exports <varma.v.business@gmail.com>`.

---

## Deployment

### Vercel (recommended)

```bash
vercel
```

Or push to GitHub and connect the repo to [vercel.com](https://vercel.com) for automatic CI/CD.

Copy all `.env.local` variables into Vercel's **Environment Variables** settings before deploying. Set `NEXT_PUBLIC_APP_URL` to your production domain so server-side blog fetches work correctly.

---

## Business Information

| Detail | Value |
|---|---|
| Company | Sindhur Exports |
| Founded | 2009 |
| Location | Visakhapatnam, Andhra Pradesh – 530001, India |
| Email | varma.v.business@gmail.com |
| Phone / WhatsApp | +91 73308 10209 |
| Business Hours | Mon–Fri 9AM–6:30PM IST · Sat 9AM–1PM IST |
| Certifications | ISO 9001:2015, APEDA, FSSAI, FIEO, DGFT |

### Products exported (6 categories)

| # | Product | Category |
|---|---|---|
| 1 | Fresh Coconuts | Agri Commodities |
| 2 | Coconut By-Products (oil, milk powder, desiccated) | Agri Commodities |
| 3 | Basmati & Non-Basmati Rice | Agri Commodities |
| 4 | Organic Dehydrated Powders (amla, moringa, turmeric…) | Organic Products |
| 5 | Spices & Masalas | Spices |
| 6 | Herbal & Botanical Extracts (ashwagandha, neem…) | Organic Products |
