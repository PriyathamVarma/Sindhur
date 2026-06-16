# Sindhur Exports — AI Agent Reconstruction Guide

This document tells an AI agent everything needed to understand, reconstruct, or extend this project without reading every file. Read this before touching any code.

---

## What This Project Is

A **full-stack marketing website + admin panel** for "Sindhur Exports", a Visakhapatnam-based Indian B2B export company. Two distinct surfaces:

1. **Public marketing site** — Single-page landing with sections: Hero, About, Products, Global Reach, Why Choose, Process, Testimonials, Contact. Contact form submits to MongoDB via a real API call.
2. **Public blog** — `/blog` (list) and `/blog/[slug]` (full post) — Server Components, SEO-optimised with `generateMetadata`.
3. **Admin panel** — Password-protected dashboard at `/admin` for managing quote requests and authoring blog articles.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Both marketing site and API |
| UI | React 19 | |
| Language | TypeScript 5 strict | |
| Styling | Tailwind CSS v4 | PostCSS plugin (`@tailwindcss/postcss`), `@import "tailwindcss"` |
| Database | MongoDB Atlas | Mongoose 9, db name: `syndhur-exports` |
| Auth | JWT in httpOnly cookies | bcryptjs + jsonwebtoken (API) + jose (middleware/Edge) |
| Middleware | Next.js Edge Middleware | `jose` `jwtVerify` (Edge Runtime compatible) |
| Fonts | Google Fonts via next/font | DM Sans (body, `--font-sans`), Playfair Display (headings, `--font-display`) |
| Icons | lucide-react (admin/auth) + inline SVGs (marketing) | |
| Toasts | react-hot-toast | `<Toaster position="top-right" />` in root layout |
| Slug util | Custom `slugify()` in shared/lib/utils.tsx | |

**Key next.config.ts setting:** `serverExternalPackages: ["mongoose"]` — required so Next.js doesn't bundle Mongoose (it uses native Node.js modules).

---

## Complete File Structure

```
Sindhur/
├── app/
│   ├── (auth)/                           # Route group — no marketing Navbar
│   │   ├── layout.tsx                    # Minimal: <div className="min-h-screen bg-gray-50 flex flex-col">
│   │   ├── login/page.tsx                # Client: useSearchParams() inside <Suspense>; eye/EyeOff toggle; redirect to ?from
│   │   └── register/page.tsx             # Client: password confirmation client-side; redirect to /login on success
│   │
│   ├── admin/                            # JWT-protected — middleware guards /admin/*
│   │   ├── layout.tsx                    # Client: w-60 sidebar (desktop), slide-in overlay (mobile)
│   │   ├── page.tsx                      # Client: stat cards (animate-pulse skeleton), recent quotes accordion
│   │   ├── quotes/page.tsx               # Client: filter tabs, expandable rows, inline status + notes update
│   │   └── blog/
│   │       ├── page.tsx                  # Client: post list, publish toggle, edit/delete
│   │       ├── new/page.tsx              # Client: create post, auto-slug from title, HTML preview
│   │       └── [id]/edit/page.tsx        # Client: edit post; URL uses MongoDB _id; PATCH uses slug
│   │
│   ├── api/v1/
│   │   ├── utils/
│   │   │   ├── responses.tsx             # success<T>() / failure<E>() — error field only in development
│   │   │   └── verifyToken.tsx           # reads "token" cookie; jsonwebtoken.verify(); returns 401 on fail
│   │   ├── auth/
│   │   │   ├── login/route.tsx           # POST: bcrypt.compare → jwt.sign → Set-Cookie httpOnly
│   │   │   ├── register/route.tsx        # POST: duplicate check → bcrypt.hash → UserModel.create (role="Admin")
│   │   │   ├── logout/route.tsx          # POST: Set-Cookie token="" maxAge=0
│   │   │   └── me/route.tsx              # GET (JWT): UserModel.findById().select("-passwordHash")
│   │   ├── quotes/
│   │   │   ├── route.tsx                 # POST (no auth): validate name+email, create status="pending"
│   │   │   │                             # GET (JWT): paginated ?page=&limit=, filter ?status=
│   │   │   └── [id]/route.tsx            # PATCH (JWT): only status/adminNotes whitelist
│   │   │                                 # DELETE (JWT): findByIdAndDelete
│   │   ├── blog/
│   │   │   ├── route.tsx                 # GET: ?admin=true needs JWT, returns all statuses; else published only
│   │   │   │                             # Content field excluded from lists (-content projection)
│   │   │   │                             # Supports ?tag=, ?page=, ?limit=
│   │   │   │                             # POST (JWT): slugify(title), collision → slug-{Date.now()}
│   │   │   │                             # Sets publishedAt if status="published"
│   │   │   └── [slug]/route.tsx          # GET: ?admin=true skips published filter
│   │   │                                 # PATCH (JWT): any fields; sets publishedAt on publish
│   │   │                                 # DELETE (JWT): findOneAndDelete by slug
│   │   └── admin/
│   │       └── stats/route.tsx           # GET (JWT): Promise.all 7 aggregations → quotes counts, blog counts, 5 recent
│   │
│   ├── blog/
│   │   ├── page.tsx                      # Server Component: fetch /api/v1/blog, render published grid
│   │   └── [slug]/page.tsx               # Server Component: generateMetadata + full post with prose classes
│   │
│   ├── layout.tsx                        # Root: DM Sans + Playfair Display fonts, UserProvider wraps children, Toaster outside
│   ├── page.tsx                          # Homepage: all section components + SEO metadata export
│   └── globals.css                       # @import "tailwindcss"; @theme inline {}; @theme {} color tokens
│
├── components/                           # Marketing section components (Server unless noted)
│   ├── Navbar.tsx                        # Client: scroll threshold 40px, mobile hamburger, Admin link hardcoded (not in NAV_LINKS)
│   ├── HeroSection.tsx                   # Client: useRef for parallax scroll
│   ├── AboutSection.tsx                  # Server: story text, CERTIFICATIONS[], image collage, floating award card
│   ├── ProductsSection.tsx               # Server: product cards from PRODUCTS[]
│   ├── GlobalSection.tsx                 # Server: COUNTRIES[] grouped by region
│   ├── WhyChooseSection.tsx              # Server: sticky left panel + scrolling 2-col card grid
│   ├── ProcessSection.tsx                # Server: 5-step PROCESS_STEPS[] timeline
│   ├── TestimonialsSection.tsx           # Server: 3 TESTIMONIALS[] cards + brand certification strip
│   ├── ContactSection.tsx                # Client: fetch POST /api/v1/quotes (real API, not simulated); toast feedback
│   └── Footer.tsx                        # Server: FOOTER_LINKS{}, SOCIAL_LINKS[], CERTIFICATIONS[], copyright with Visakhapatnam
│
├── shared/
│   ├── context/
│   │   └── UserContext.tsx               # useUser(); ILoggedinUser { id, name?, email, role? }
│   │                                     # localStorage key: "se_user" (not "user")
│   │                                     # On mount: rehydrate from /api/v1/auth/me if no user in state
│   ├── interfaces/mongodb/
│   │   ├── users/user.tsx                # IUser, UserRole = "Admin"
│   │   ├── quotes/quoteRequest.tsx       # IQuoteRequest, QuoteStatus = "pending"|"reviewing"|"responded"|"closed"
│   │   └── blog/blogPost.tsx             # IBlogPost, PostStatus = "draft"|"published"
│   ├── lib/
│   │   ├── db/mongo.tsx                  # mongoDB() singleton — globalThis._mongoCache pattern
│   │   └── utils.tsx                     # cx(...args), slugify(text), formatDate(date) [en-IN locale]
│   └── models/mongodb/
│       ├── users/user.tsx                # mongoose.models.User || mongoose.model("User", userSchema)
│       ├── quotes/quoteRequest.tsx       # QuoteRequestModel — status indexed, compound { status, createdAt }
│       └── blog/blogPost.tsx             # BlogPostModel — slug unique+indexed, compound { status, publishedAt }
│
├── lib/
│   └── data.ts                           # PRODUCTS (6), TESTIMONIALS (3), PROCESS_STEPS (5),
│                                         # WHY_CHOOSE (6), COUNTRIES (16), NAV_LINKS (6, includes Blog → /blog)
├── types/
│   └── index.ts                          # Product, Testimonial, ProcessStep, WhyChooseItem, Country, NavLink
│
├── middleware.ts                         # Edge Runtime: jose jwtVerify protects /admin/:path*; redirects to /login?from=
├── next.config.ts                        # serverExternalPackages: ["mongoose"], image remotePatterns (unsplash, supabase)
├── tsconfig.json                         # strict, paths: { "@/*": ["./*"] }
├── postcss.config.mjs                    # plugins: { "@tailwindcss/postcss": {} }
├── package.json                          # 10 runtime deps (see below)
└── .env.local                            # Secrets — NEVER commit
```

---

## Runtime Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "jose": "^6.2.3",
  "jsonwebtoken": "^9.0.3",
  "lucide-react": "^1.18.0",
  "marked": "^18.0.5",
  "mongoose": "^9.7.0",
  "next": "^16.2.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-hot-toast": "^2.6.0"
}
```

Dev only: `@tailwindcss/postcss`, `@types/bcryptjs`, `@types/jsonwebtoken`, `@types/marked`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `tailwindcss`, `typescript`

---

## Data Flows

### Public contact form → admin inbox

```
User fills ContactSection.tsx
  → fetch("/api/v1/quotes", { method: "POST", body: JSON.stringify({ name, email, company?, country?, product?, message? }) })
  → POST /api/v1/quotes (no auth required)
  → validates: name + email required
  → QuoteRequestModel.create({ ...fields, status: "pending" })
  → MongoDB collection: quoterequests
  → Admin views at /admin/quotes via GET /api/v1/quotes (JWT required)
```

### Admin authentication flow

```
/login page
  → POST /api/v1/auth/login { email, password }
  → bcrypt.compare(password, user.passwordHash)
  → jwt.sign({ sub: user._id, email, role }, JWT_SECRET, { expiresIn: "7d" })
  → Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
  → UserContext.login({ id, name, email, role })
  → localStorage.setItem("se_user", JSON.stringify(user))
  → router.push(from || "/admin")

Every /admin/* request (before page renders)
  → middleware.ts (Edge Runtime)
  → reads cookies().get("token")?.value
  → jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  → invalid/missing → NextResponse.redirect("/login?from=<pathname>")

Every admin API call
  → verifyToken(req) in route handler (Node.js runtime)
  → jsonwebtoken.verify(token, JWT_SECRET)
  → invalid → NextResponse.json({ message: "Unauthorized" }, { status: 401 })

Logout
  → UserContext.logout()
  → clears localStorage "se_user"
  → POST /api/v1/auth/logout
  → Set-Cookie: token=""; Max-Age=0 (clears the httpOnly cookie)
```

### Blog publishing flow

```
Admin at /admin/blog/new
  → fills title → slugify(title) auto-fills slug input
  → HTML content in textarea; Preview toggle uses dangerouslySetInnerHTML
  → "Save Draft" → POST /api/v1/blog { ..., status: "draft" }
  → "Publish Now" → POST /api/v1/blog { ..., status: "published" }
  → server sets publishedAt = new Date() if status === "published"

Public at /blog (Server Component)
  → fetch(`${NEXT_PUBLIC_APP_URL}/api/v1/blog`, { cache: "no-store" })
  → returns only { status: "published" } posts
  → content field excluded from list (slug and excerpt only)

Individual post at /blog/[slug] (Server Component)
  → fetch(`${NEXT_PUBLIC_APP_URL}/api/v1/blog/${slug}`)
  → generateMetadata() also calls same endpoint
  → full content rendered via dangerouslySetInnerHTML + Tailwind prose classes

Admin edit at /admin/blog/[id]/edit
  → URL param is MongoDB _id (not slug)
  → page fetches GET /api/v1/blog?admin=true&limit=100
  → finds post in response array where post._id === id
  → PATCH is sent to /api/v1/blog/${post.slug} (API is slug-based, not id-based)
```

---

## MongoDB Schemas

Do NOT use `new Schema<IType>()` generics — causes TypeScript errors when interfaces use `string` but Mongoose internally uses `ObjectId`. Use plain `new Schema({...})`.

### User (collection: `users`)

```
name:         String, required, trim
email:        String, required, unique, lowercase, trim
passwordHash: String, required
role:         String, enum ["Admin"], default "Admin"
timestamps:   true
```

### QuoteRequest (collection: `quoterequests`)

```
name:        String, required
company:     String
email:       String, required, lowercase
country:     String
product:     String
message:     String
status:      String, enum ["pending","reviewing","responded","closed"], default "pending"
adminNotes:  String
timestamps:  true
indexes:     { status: 1 }, { createdAt: -1 }, { status: 1, createdAt: -1 }
```

### BlogPost (collection: `blogposts`)

```
title:       String, required
slug:        String, required, unique, lowercase — indexed
excerpt:     String, required
content:     String, required  ← raw HTML
coverImage:  String
tags:        [String], default []
status:      String, enum ["draft","published"], default "draft" — indexed
authorId:    String  ← JWT sub (user._id as string)
publishedAt: Date    ← set automatically on publish
timestamps:  true
indexes:     { slug: 1 unique }, { status: 1 }, { status: 1, publishedAt: -1 }
```

---

## Interfaces

### `IUser` — `shared/interfaces/mongodb/users/user.tsx`

```ts
export type UserRole = "Admin";
export interface IUser {
  _id?: string; name: string; email: string; passwordHash: string;
  role: UserRole; createdAt?: Date; updatedAt?: Date;
}
```

### `IQuoteRequest` — `shared/interfaces/mongodb/quotes/quoteRequest.tsx`

```ts
export type QuoteStatus = "pending" | "reviewing" | "responded" | "closed";
export interface IQuoteRequest {
  _id?: string; name: string; company?: string; email: string;
  country?: string; product?: string; message?: string;
  status: QuoteStatus; adminNotes?: string; createdAt?: Date; updatedAt?: Date;
}
```

### `IBlogPost` — `shared/interfaces/mongodb/blog/blogPost.tsx`

```ts
export type PostStatus = "draft" | "published";
export interface IBlogPost {
  _id?: string; title: string; slug: string; excerpt: string; content: string;
  coverImage?: string; tags: string[]; status: PostStatus; authorId?: string;
  publishedAt?: Date; createdAt?: Date; updatedAt?: Date;
}
```

### `ILoggedinUser` — `shared/context/UserContext.tsx`

```ts
export interface ILoggedinUser {
  id: string; name?: string; email: string; role?: string;
}
```

---

## API Response Contract

All responses use the same typed helpers from `app/api/v1/utils/responses.tsx`:

```ts
// Success (200 or 201)
{ success: true, message: "...", data: T }

// Failure (400/401/404/409/500)
{ success: false, message: "...", error?: string }  // error only when NODE_ENV === "development"

// Paginated lists (inside data)
{ items: T[], meta: { total: number, page: number, limit: number, totalPages: number } }
```

---

## API Endpoint Table

| Method | Path | Auth | Body / Query | Notes |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | — | `{ email, password }` | Sets httpOnly cookie `token` |
| POST | `/api/v1/auth/register` | — | `{ name, email, password }` | Role hardcoded "Admin" |
| POST | `/api/v1/auth/logout` | — | — | Clears `token` cookie |
| GET | `/api/v1/auth/me` | JWT cookie | — | Returns user minus `passwordHash` |
| POST | `/api/v1/quotes` | — | `{ name, email, company?, country?, product?, message? }` | Creates with `status: "pending"` |
| GET | `/api/v1/quotes` | JWT cookie | `?status=&page=&limit=` | Paginated list |
| PATCH | `/api/v1/quotes/[id]` | JWT cookie | `{ status?, adminNotes? }` | Only these two fields updatable |
| DELETE | `/api/v1/quotes/[id]` | JWT cookie | — | `findByIdAndDelete` |
| GET | `/api/v1/blog` | — / JWT | `?admin=true&tag=&page=&limit=` | `admin=true` requires JWT; `-content` projection always |
| POST | `/api/v1/blog` | JWT cookie | `{ title, excerpt, content, coverImage?, tags?, status? }` | Auto-generates slug |
| GET | `/api/v1/blog/[slug]` | — / JWT | `?admin=true` | Full document including content |
| PATCH | `/api/v1/blog/[slug]` | JWT cookie | any `IBlogPost` fields | Sets `publishedAt` if publishing |
| DELETE | `/api/v1/blog/[slug]` | JWT cookie | — | `findOneAndDelete({ slug })` |
| GET | `/api/v1/admin/stats` | JWT cookie | — | `{ quotes: {total, pending, reviewing}, blog: {total, published, drafts}, recentQuotes: [...5] }` |

---

## Design System

### Tailwind v4 color tokens — `app/globals.css`

```css
@theme {
  --color-primary: #f97316;           /* orange-500 */
  --color-primary-hover: #ea580c;     /* orange-600 */
  --color-primary-foreground: #ffffff;
  --color-primary-subtle: #fff7ed;    /* orange-50 */
  --color-surface: #f9fafb;           /* gray-50 */
  --color-surface-card: #ffffff;
  --color-dark: #030712;              /* gray-950 */
  --color-foreground-heading: #111827;
  --color-foreground-body: #4b5563;
  --color-foreground-muted: #9ca3af;
  --color-border: #f3f4f6;
  --color-border-input: #e5e7eb;
  --color-border-focus: #fb923c;
  /* plus --color-status-{warning,info,success,danger} and -surface variants */
}
```

### Typography

- `--font-sans` = DM Sans (set by `next/font/google` on `<html>` element) — body text, UI components
- `--font-display` = Playfair Display — marketing headings (`font-[family-name:var(--font-display)]`)

### Section background alternation

```
Hero (bg-gray-950) → About (bg-white) → Products (bg-gray-50) → Global (bg-gray-950)
→ WhyChoose (bg-white) → Process (bg-gray-50) → Testimonials (bg-white) → Contact (bg-gray-50)
→ Footer (bg-gray-950)
```

### Marketing vs admin styling

Marketing components use **raw Tailwind** (orange-500, gray-900 etc.) — they're fixed sections, never shared. Admin and auth components use **semantic tokens** (`text-primary`, `bg-surface-card`, `border-border-input`).

---

## Key Behaviours Agents Must Know

### Navbar Admin link

The Admin link (`href="/admin"`) is **hardcoded** in `Navbar.tsx`, not added to `NAV_LINKS` in `lib/data.ts`. This is intentional — it renders with a distinct bordered style. The mobile hamburger menu does NOT show the Admin link.

### Login page and `useSearchParams`

`app/(auth)/login/page.tsx` uses `useSearchParams()` inside an inner component, which requires a `<Suspense>` boundary at the page export level. The outer default export is a Server Component that wraps the inner Client Component in `<Suspense>`. Without this, Next.js throws a prerender error.

### Blog edit page: _id in URL vs slug in API

`/admin/blog/[id]/edit` uses the MongoDB `_id` in the URL (not slug), but:
- There is no single-post-by-id API endpoint
- The edit page fetches `GET /api/v1/blog?admin=true&limit=100` (all posts, no content)
- It finds the post in the list where `post._id === params.id`
- All updates go to `PATCH /api/v1/blog/${post.slug}` (slug-based)

This is necessary because the blog list API returns `_id` from Mongoose, but the single-post API is keyed by slug.

### MongoDB singleton

`shared/lib/db/mongo.tsx` uses `globalThis._mongoCache` to prevent creating a new connection on every hot-reload in development. Pattern:

```ts
declare global { var _mongoCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }; }
const cache = globalThis._mongoCache ?? { conn: null, promise: null };
globalThis._mongoCache = cache;
```

### Slug uniqueness on creation

```ts
let slug = slugify(title);
const exists = await BlogPostModel.findOne({ slug });
if (exists) slug = `${slug}-${Date.now()}`;
```

### publishedAt is automatic

When creating or patching a post with `status === "published"` and `publishedAt` is not already set, the API sets it to `new Date()`. Never set it from the client — always let the server handle it.

### verifyToken return type

`verifyToken()` returns either:
- A `NextResponse` (401 JSON) if the token is invalid — route must `return` it immediately
- A decoded JWT payload object if valid — use `payload.sub` as the user ID

Pattern used in every protected API route:
```ts
const authResult = await verifyToken(req);
if (authResult instanceof NextResponse) return authResult;
// authResult is now the JWT payload
```

---

## Products (6 current — `lib/data.ts`)

| Title | Category | Certifications |
|---|---|---|
| Fresh Coconuts | Agri Commodities | APEDA, Grade A, Bulk & Retail |
| Coconut By-Products | Agri Commodities | FSSAI, ISO 22000, Private Label |
| Basmati & Non-Basmati Rice | Agri Commodities | APEDA, ISO 22000, Organic Available |
| Organic Dehydrated Powders | Organic Products | Organic Certified, Non-GMO, 100+ SKUs |
| Spices & Masalas | Spices | APEDA, GMP Certified, Bulk & Retail |
| Herbal & Botanical Extracts | Organic Products | GMP Certified, Lab Tested, COA Available |

---

## What Does NOT Exist — Avoid Hallucinating

- No `/api/v2/` routes
- No rate limiting (Redis/Upstash packages in `.env.local` but zero wiring in code)
- No email notifications (Brevo SMTP configured but no mailer utility or email-sending routes)
- No image upload UI (Supabase configured but no upload component or presigned URL route)
- No roles beyond `"Admin"` (no `"Buyer"`, `"Manager"`, `"Farmer"` etc.)
- No `src/` directory — all files at project root
- No Storybook, Jest, Playwright, or any test files
- No i18n / locale routing
- No dark mode toggle (dark sections use hardcoded `bg-gray-950`, not system preference)
- No `/api/v1/blog/[id]` endpoint — blog API is slug-based, not id-based
- No BullMQ workers or background jobs
- No CI/CD configuration (no `.github/workflows/`, no Dockerfile)
- The mobile Navbar does NOT include the Admin link (it is desktop-only)
- The `/api/v1/blog` list endpoint always omits the `content` field — never returns full HTML in lists

---

## Business Information

| Field | Value |
|---|---|
| Company | Sindhur Exports |
| Founded | 2009 |
| HQ | Visakhapatnam, Andhra Pradesh – 530001, India |
| Email | varma.v.business@gmail.com |
| Phone / WhatsApp | +91 73308 10209 (`wa.me/917330810209`) |
| Business Hours | Mon–Fri 9AM–6:30PM IST · Sat 9AM–1PM IST |
| Certifications | ISO 9001:2015, APEDA, FSSAI, FIEO, DGFT |
| Key stats | 50+ countries, 15+ years, 2000+ shipments/year, 98% on-time delivery |

---

## Environment Variables (`.env.local`)

| Variable | Used In |
|---|---|
| `MONGODB_URI` | `shared/lib/db/mongo.tsx` |
| `JWT_SECRET` | `middleware.ts` (jose), `verifyToken.tsx` (jsonwebtoken), login route (jsonwebtoken) |
| `JWT_EXPIRES_IN` | login route — `jwt.sign(payload, secret, { expiresIn })` |
| `JWT_COOKIE_MAX_AGE` | login route — `Set-Cookie Max-Age` (seconds, e.g. `604800`) |
| `BCRYPT_SALT_ROUNDS` | register route — `bcrypt.hash(password, rounds)` |
| `NEXT_PUBLIC_APP_URL` | blog Server Components — `fetch(`${NEXT_PUBLIC_APP_URL}/api/v1/blog`)` |
| `BREVO_*` | Not yet wired (reserved for email notifications) |
| `NEXT_PUBLIC_SUPABASE_*` | Not yet wired (reserved for image uploads) |
| `OPENAI_API_KEY` | Not yet wired (reserved for future AI features) |
| `REDIS_URL` / `UPSTASH_*` | Not yet wired (reserved for rate limiting / caching) |

> **Before going live**: update `EMAIL_FROM` from `FR3SH <hello@farmers-republic.com>` to `Sindhur Exports <varma.v.business@gmail.com>`. Set `NEXT_PUBLIC_APP_URL` to the production domain.
