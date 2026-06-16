# Sindhur Exports — B2B Export Platform

Full-stack B2B export business platform for **Sindhur Exports**, a Visakhapatnam-based Indian export company. Built with Next.js 16 App Router, React 19, MongoDB Atlas, Tailwind CSS v4, and Supabase Storage.

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
- [File Uploads](#file-uploads)
- [WhatsApp Integration](#whatsapp-integration)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Business Information](#business-information)

---

## Overview

The platform serves three audiences:

**Public / International Buyers** — Browse the product catalog at `/products`, view detailed product pages at `/products/[slug]`, submit RFQ forms at `/request-quote`, download company brochures and catalogs at `/downloads`, and view trust & certifications at `/trust`. A floating WhatsApp button appears on all public pages.

**Blog readers** — `/blog` provides SEO-rich trade insight articles for organic discovery.

**Admin / Staff** — Log in at `/login`, then manage the full B2B pipeline: product catalog, RFQ pipeline, certifications, downloadable resources, download leads, legacy quote requests, and blog articles. All admin routes are JWT-protected at the Edge layer.

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
| File storage | Supabase Storage | ^2.108.2 |
| Supabase SSR | @supabase/ssr | ^0.12.0 |
| Password hashing | bcryptjs | ^3.0.3 |
| JWT (API routes) | jsonwebtoken | ^9.0.3 |
| JWT (middleware/Edge) | jose | ^6.2.3 |
| Icons (admin UI) | lucide-react | ^1.18.0 |
| Markdown parsing | marked | ^18.0.5 |
| Redis cache | @upstash/redis | ^1.38.0 |
| Toast notifications | react-hot-toast | ^2.6.0 |
| Fonts | Google Fonts via next/font | — |

**Dev dependencies:** `@tailwindcss/postcss`, `@types/bcryptjs`, `@types/jsonwebtoken`, `@types/marked`, `eslint`, `eslint-config-next`

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster with the `syndhur-exports` database (configured in `.env.local`)
- A Supabase project with a storage bucket named `products` (configured in `.env.local`)

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
│   │   ├── layout.tsx                  # Sidebar layout + client-side auth guard (8 nav items)
│   │   ├── page.tsx                    # Dashboard: 8 stat cards + quick actions + recent quotes
│   │   ├── products/
│   │   │   ├── page.tsx                # Product list with filter tabs, publish toggle, edit/delete
│   │   │   ├── new/page.tsx            # Product creation form (8 sections, MultiImageUpload)
│   │   │   └── [id]/edit/page.tsx      # Edit product (URL uses _id; fetches full product by id/slug)
│   │   ├── rfq/page.tsx                # RFQ pipeline: status tabs, search, expandable accordions
│   │   ├── certifications/page.tsx     # Certifications list + slide-in add/edit panel (UploadInput)
│   │   ├── downloads/page.tsx          # Downloads list + slide-in add/edit panel (UploadInput)
│   │   ├── download-leads/page.tsx     # View-only leads table with pagination
│   │   ├── quotes/page.tsx             # Legacy quote request manager
│   │   └── blog/
│   │       ├── page.tsx                # Blog post list
│   │       ├── new/page.tsx            # Create post form (UploadInput for cover image)
│   │       └── [id]/edit/page.tsx      # Edit post form (UploadInput for cover image)
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
│   │   ├── products/
│   │   │   ├── route.tsx               # GET (public/JWT): list with search/category/page; POST (JWT): create
│   │   │   └── [slug]/route.tsx        # GET (public/JWT): single; PATCH (JWT): update; DELETE (JWT)
│   │   ├── rfq/
│   │   │   ├── route.tsx               # POST (public): create RFQ; GET (JWT): list with filters
│   │   │   └── [id]/route.tsx          # PATCH (JWT): status + adminNotes only; DELETE (JWT)
│   │   ├── certifications/
│   │   │   ├── route.tsx               # GET (public/JWT): list; POST (JWT): create
│   │   │   └── [id]/route.tsx          # PATCH (JWT): update; DELETE (JWT)
│   │   ├── downloads/
│   │   │   ├── route.tsx               # GET (public/JWT): list; POST (JWT): create
│   │   │   └── [id]/route.tsx          # PATCH (JWT): update; DELETE (JWT)
│   │   ├── download-leads/
│   │   │   ├── route.tsx               # POST (public): capture lead + return fileUrl; GET (JWT): list
│   │   │   └── [id]/route.tsx          # DELETE (JWT)
│   │   ├── quotes/
│   │   │   ├── route.tsx               # POST (public): create; GET (JWT): list paginated
│   │   │   └── [id]/route.tsx          # PATCH/DELETE (JWT)
│   │   ├── blog/
│   │   │   ├── route.tsx               # GET (public/JWT): list; POST (JWT): create
│   │   │   └── [slug]/route.tsx        # GET (public/JWT): single; PATCH/DELETE (JWT)
│   │   └── admin/
│   │       └── stats/route.tsx         # GET (JWT): all platform counts + 5 recent quotes
│   │
│   ├── products/
│   │   ├── page.tsx                    # Server Component: fetches products, passes to ProductCatalog
│   │   ├── [slug]/page.tsx             # Server Component: full product page with generateMetadata
│   │   └── [slug]/edit/page.tsx        # Redirect shim → /admin/products/[slug]/edit
│   ├── request-quote/
│   │   └── page.tsx                    # Client Component (wrapped in Suspense): RFQ form
│   ├── trust/
│   │   └── page.tsx                    # Server Component: certifications + QA steps + stats
│   ├── downloads/
│   │   └── page.tsx                    # Client Component: download catalog with lead capture modal
│   ├── blog/
│   │   ├── page.tsx                    # Server Component: published post grid
│   │   └── [slug]/page.tsx             # Server Component: full post + generateMetadata
│   │
│   ├── layout.tsx                      # Root: fonts, UserProvider, Toaster, WhatsAppButton
│   ├── page.tsx                        # Homepage: all marketing sections + SEO metadata
│   └── globals.css                     # Tailwind v4 import + @theme {} color tokens
│
├── components/
│   ├── admin/
│   │   ├── MultiImageUpload.tsx        # Client: multi-image upload grid → Supabase Storage
│   │   └── UploadInput.tsx             # Client: single file/image upload → Supabase Storage
│   ├── Navbar.tsx                      # Client: scroll-aware, mobile hamburger, Blog + Admin links
│   ├── HeroSection.tsx                 # Client: parallax scroll via useRef
│   ├── AboutSection.tsx                # Server: story, certifications, image collage
│   ├── ProductsSection.tsx             # Server: 6-card static product grid (homepage only)
│   ├── ProductCatalog.tsx              # Client: interactive filter + search over server-fetched products
│   ├── ProductGallery.tsx              # Client: image gallery with prev/next and thumbnail strip
│   ├── WhatsAppButton.tsx              # Client: floating sticky button (hides on admin/login routes)
│   ├── GlobalSection.tsx               # Server: countries grouped by region
│   ├── WhyChooseSection.tsx            # Server: sticky left panel + 2-col card grid
│   ├── ProcessSection.tsx              # Server: 5-step horizontal timeline
│   ├── TestimonialsSection.tsx         # Server: 3 testimonial cards + brand strip
│   ├── ContactSection.tsx              # Client: form → POST /api/v1/quotes
│   └── Footer.tsx                      # Server: links, real contact info, social icons
│
├── utils/
│   ├── redis.ts                        # Lazy-init Upstash Redis client; cacheGet/cacheSet/cacheDel; CACHE_KEYS; TTL constants
│   └── supabase/
│       ├── client.ts                   # createBrowserClient() — used in Client Components
│       ├── server.ts                   # createServerClient() — used in Server Components / API routes
│       ├── middleware.ts               # createClient() for Next.js middleware context
│       └── storage.ts                 # SUPABASE_STORAGE_BUCKET constant + getUploadErrorMessage()
│
├── shared/
│   ├── context/
│   │   └── UserContext.tsx             # useUser() hook; localStorage key: "se_user"
│   ├── interfaces/mongodb/
│   │   ├── users/user.tsx              # IUser, UserRole
│   │   ├── quotes/quoteRequest.tsx     # IQuoteRequest, QuoteStatus
│   │   ├── blog/blogPost.tsx           # IBlogPost, PostStatus
│   │   ├── products/product.tsx        # IProduct, IProductSpecification, ProductStatus
│   │   ├── rfq/rfq.tsx                 # IRFQ, RFQStatus, BusinessType
│   │   ├── certifications/certification.tsx  # ICertification, CertificationStatus
│   │   ├── downloads/download.tsx      # IDownload, DownloadType, DownloadStatus
│   │   └── downloads/downloadLead.tsx  # IDownloadLead
│   ├── lib/
│   │   ├── db/mongo.tsx                # mongoDB() singleton (globalThis._mongoCache)
│   │   └── utils.tsx                   # cx(), slugify(), formatDate()
│   └── models/mongodb/
│       ├── users/user.tsx              # Mongoose User model
│       ├── quotes/quoteRequest.tsx     # Mongoose QuoteRequest model
│       ├── blog/blogPost.tsx           # Mongoose BlogPost model
│       ├── products/product.tsx        # Mongoose Product model (nested spec subdocument)
│       ├── rfq/rfq.tsx                 # Mongoose RFQ model
│       ├── certifications/certification.tsx  # Mongoose Certification model
│       ├── downloads/download.tsx      # Mongoose Download model
│       └── downloads/downloadLead.tsx  # Mongoose DownloadLead model
│
├── lib/
│   └── data.ts                         # Static marketing content (NAV_LINKS now points /products)
├── types/
│   └── index.ts                        # TypeScript types for marketing data shapes
│
├── middleware.ts                        # Edge: jose jwtVerify → protects /admin/:path*
├── proxy.ts                            # Standalone JWT proxy utility (mirrors middleware logic)
├── next.config.ts                       # serverExternalPackages: ["mongoose"], image remotePatterns (Unsplash + Supabase)
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
| `/products` | Server + Client | Product catalog with interactive search/filter |
| `/products/[slug]` | Dynamic (SSR) | Full product page: gallery, specs, CTA, WhatsApp pre-fill |
| `/products/[slug]/edit` | Redirect | Redirects to `/admin/products/[slug]/edit` |
| `/request-quote` | Client (Suspense) | Advanced RFQ form; pre-fills from `?product=` param |
| `/trust` | Server (SSR) | Certifications, QA process, stats — pulls live DB data |
| `/downloads` | Client | Download center with gated lead capture modal |
| `/blog` | Dynamic (SSR) | Published blog post grid |
| `/blog/[slug]` | Dynamic (SSR) | Individual post with full SEO metadata |
| `/login` | Static | Admin login form |
| `/register` | Static | Admin registration form |

### Admin Routes — protected by `middleware.ts`

| Path | Description |
|---|---|
| `/admin` | Dashboard — 8 stat cards (RFQ, leads, quotes, blog) + quick actions |
| `/admin/products` | Product list — filter by status, publish toggle, edit/delete |
| `/admin/products/new` | Create product — 8 form sections, MultiImageUpload |
| `/admin/products/[id]/edit` | Edit product — URL uses MongoDB `_id`, full upload support |
| `/admin/rfq` | RFQ pipeline — 8 status tabs, search, expandable accordions, email/WA links |
| `/admin/certifications` | Certifications — list + slide-in add/edit panel with image upload |
| `/admin/downloads` | Downloads — list + slide-in add/edit, file upload, publish toggle |
| `/admin/download-leads` | Download leads — view-only table with pagination |
| `/admin/quotes` | Legacy quote request list, status management, admin notes |
| `/admin/blog` | Blog post list — publish/unpublish, delete |
| `/admin/blog/new` | Create new article with cover image upload |
| `/admin/blog/[id]/edit` | Edit existing article with cover image upload |

### API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | — | Login; sets `token` httpOnly cookie |
| `POST` | `/api/v1/auth/register` | — | Create admin account |
| `POST` | `/api/v1/auth/logout` | — | Clears `token` cookie |
| `GET` | `/api/v1/auth/me` | JWT | Return current user (no `passwordHash`) |
| `GET` | `/api/v1/products` | — / JWT | List products; `?admin=true` returns all statuses |
| `POST` | `/api/v1/products` | JWT | Create product; auto-generates slug |
| `GET` | `/api/v1/products/[slug]` | — / JWT | Single product; `?admin=true` skips published filter |
| `PATCH` | `/api/v1/products/[slug]` | JWT | Update any product field |
| `DELETE` | `/api/v1/products/[slug]` | JWT | Delete product by slug |
| `POST` | `/api/v1/rfq` | — | Submit RFQ from public form |
| `GET` | `/api/v1/rfq` | JWT | List RFQs with status/country/product/search filters |
| `PATCH` | `/api/v1/rfq/[id]` | JWT | Update `status` and/or `adminNotes` only |
| `DELETE` | `/api/v1/rfq/[id]` | JWT | Delete RFQ |
| `GET` | `/api/v1/certifications` | — / JWT | List certs; `?admin=true` returns all statuses |
| `POST` | `/api/v1/certifications` | JWT | Create certification |
| `PATCH` | `/api/v1/certifications/[id]` | JWT | Update certification |
| `DELETE` | `/api/v1/certifications/[id]` | JWT | Delete certification |
| `GET` | `/api/v1/downloads` | — / JWT | List downloads; `?admin=true` returns all statuses |
| `POST` | `/api/v1/downloads` | JWT | Create download resource |
| `PATCH` | `/api/v1/downloads/[id]` | JWT | Update download resource |
| `DELETE` | `/api/v1/downloads/[id]` | JWT | Delete download resource |
| `POST` | `/api/v1/download-leads` | — | Capture lead + return fileUrl for frontend to trigger download |
| `GET` | `/api/v1/download-leads` | JWT | List all download leads, paginated |
| `DELETE` | `/api/v1/download-leads/[id]` | JWT | Delete a lead record |
| `POST` | `/api/v1/quotes` | — | Submit legacy quote request |
| `GET` | `/api/v1/quotes` | JWT | List quote requests, paginated |
| `PATCH` | `/api/v1/quotes/[id]` | JWT | Update `status` and/or `adminNotes` |
| `DELETE` | `/api/v1/quotes/[id]` | JWT | Delete a quote request |
| `GET` | `/api/v1/blog` | — / JWT | List posts; `?admin=true` returns all statuses |
| `POST` | `/api/v1/blog` | JWT | Create blog post |
| `GET` | `/api/v1/blog/[slug]` | — / JWT | Single post; `?admin=true` skips published filter |
| `PATCH` | `/api/v1/blog/[slug]` | JWT | Update post fields |
| `DELETE` | `/api/v1/blog/[slug]` | JWT | Delete post by slug |
| `GET` | `/api/v1/admin/stats` | JWT | All platform counts + 5 recent legacy quotes |

---

## Data Models & Interfaces

### `IProduct` — `shared/interfaces/mongodb/products/product.tsx`

```ts
export type ProductStatus = "draft" | "published";
export interface IProductSpecification { label: string; value: string; }

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;                   // auto-generated via slugify(name)
  category: string;
  shortDescription: string;
  fullDescription: string;        // raw HTML
  images: string[];               // Supabase Storage public URLs
  scientificName?: string;
  hsCode?: string;
  origin?: string;
  availableGrades: string[];
  specifications: IProductSpecification[];   // nested subdocument array
  moq?: string;
  packagingOptions: string[];
  containerCapacity?: string;
  shelfLife?: string;
  certifications: string[];
  leadTime?: string;
  incotermsSupported: string[];   // e.g. ["FOB", "CIF"]
  paymentTerms: string[];         // e.g. ["LC", "TT"]
  exportMarkets: string[];
  privateLabelAvailable: boolean;
  sampleAvailable: boolean;
  status: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Mongoose schema notes:**
- Specifications use `new Schema({ label: String, value: String }, { _id: false })` (no TypeScript generic)
- Indexes: `{ status: 1, createdAt: -1 }`, `{ category: 1, status: 1 }`

---

### `IRFQ` — `shared/interfaces/mongodb/rfq/rfq.tsx`

```ts
export type RFQStatus = "new" | "contacted" | "negotiation" | "sample_sent" | "quotation_sent" | "won" | "lost";
export type BusinessType = "Importer" | "Distributor" | "Retailer" | "Wholesaler" | "Manufacturer" | "Other";

export interface IRFQ {
  _id?: string;
  buyerName: string;
  companyName: string;
  email: string;
  phone?: string;
  country: string;
  businessType: BusinessType;
  productInterested: string;
  quantityRequired?: string;
  targetPrice?: string;
  destinationPort?: string;
  preferredIncoterm?: string;
  packagingRequirements?: string;
  customRequirements?: string;
  message?: string;
  uploadedDocumentUrl?: string;
  status: RFQStatus;              // default: "new"
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Indexes:** `{ createdAt: -1 }`, `{ status: 1, createdAt: -1 }`, `{ country: 1 }`

---

### `ICertification` — `shared/interfaces/mongodb/certifications/certification.tsx`

```ts
export type CertificationStatus = "active" | "expired" | "hidden";

export interface ICertification {
  _id?: string;
  name: string;
  issuingAuthority: string;
  certificateNumber?: string;
  validFrom?: Date;
  validTo?: Date;
  imageUrl?: string;
  documentUrl?: string;
  description?: string;
  status: CertificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

### `IDownload` — `shared/interfaces/mongodb/downloads/download.tsx`

```ts
export type DownloadType = "Company Profile" | "Product Catalog" | "Certification" | "Brochure" | "Other";
export type DownloadStatus = "draft" | "published";

export interface IDownload {
  _id?: string;
  title: string;
  description: string;
  fileUrl: string;
  type: DownloadType;
  requiresLeadCapture: boolean;  // if true, show lead form before download
  status: DownloadStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

### `IDownloadLead` — `shared/interfaces/mongodb/downloads/downloadLead.tsx`

```ts
export interface IDownloadLead {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
  phone?: string;
  downloadId: string;      // references Download._id
  downloadTitle: string;   // denormalised for display
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

### `IUser`, `IQuoteRequest`, `IBlogPost`

See [Authentication](#authentication) and [Blog System](#blog-system) sections.

---

## API Reference

### Standard response envelope

```jsonc
// Success
{ "success": true, "message": "...", "data": <payload> }

// Failure
{ "success": false, "message": "...", "error": "..." }  // error omitted in production
```

### Paginated list shape (inside `data`)

```jsonc
{ "items": [], "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 } }
```

### Query parameters

**Products list** `GET /api/v1/products`
- `?admin=true` — bypass published filter (requires JWT)
- `?category=Spices` — filter by category
- `?search=turmeric` — search name + shortDescription
- `?page=1&limit=20` — pagination
- Note: `fullDescription` and `specifications` are excluded from list responses

**RFQ list** `GET /api/v1/rfq`
- `?status=new|contacted|negotiation|sample_sent|quotation_sent|won|lost`
- `?country=UAE`
- `?product=coconut` — regex match on `productInterested`
- `?search=` — matches `buyerName`, `companyName`, `email`
- `?page=1&limit=20` — max `limit` is 500 (admin fetches up to 500 at once for client-side filtering)

**Certifications** `GET /api/v1/certifications`
- `?admin=true` — returns all statuses (requires JWT); else only `{ status: "active" }`

**Downloads** `GET /api/v1/downloads`
- `?admin=true` — returns all statuses (requires JWT); else only `{ status: "published" }`

**Download lead capture** `POST /api/v1/download-leads`
- Body: `{ name, email, company?, country?, phone?, downloadId }`
- Response `data`: `{ lead: IDownloadLead, fileUrl: string }` — frontend uses `fileUrl` to trigger `window.open(fileUrl, '_blank')` after form submit

**Admin stats** `GET /api/v1/admin/stats`
- Returns: `{ quotes: {total, pending, reviewing}, blog: {total, published, drafts}, rfq: {total, new, won}, downloadLeads: {total}, recentQuotes: [...5] }`

---

## Design System

### Tailwind v4 setup

`app/globals.css` uses `@import "tailwindcss"` (v4 syntax). Custom tokens live in `@theme {}`.

### Fonts

```ts
const dmSans   = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["300","400","500","600","700","800","900"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["700","800","900"] });
```

### Reusable admin input class

```ts
const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 " +
  "focus:border-orange-400 transition";
```

### Marketing section background alternation

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

1. **Edge middleware** (`middleware.ts`): `jose`'s `jwtVerify` runs on every `/admin/*` request. Invalid or missing token → redirect to `/login?from=<original-path>`.
2. **Client guard** (`admin/layout.tsx`): `useUser()` in `useEffect` — if `!loading && !user`, redirect to `/login`.

### Sidebar navigation (8 items)

| Icon | Label | Route |
|---|---|---|
| `LayoutDashboard` | Dashboard | `/admin` |
| `Package` | Products | `/admin/products` |
| `ClipboardList` | RFQ Pipeline | `/admin/rfq` |
| `Award` | Certifications | `/admin/certifications` |
| `Download` | Downloads | `/admin/downloads` |
| `UserCheck` | Download Leads | `/admin/download-leads` |
| `MessageSquare` | Quote Requests | `/admin/quotes` |
| `FileText` | Blog Posts | `/admin/blog` |

Plus **View Website** (`Globe`) and user avatar + logout at the bottom.

### Dashboard stats (8 cards)

Fetches `GET /api/v1/admin/stats` in one round trip:
- Total RFQs, New RFQs, Deals Won, Download Leads, Quote Requests, Pending Replies, Published Posts, Draft Posts

Each card links to its respective admin route.

### RFQ Pipeline (`/admin/rfq`)

- **Pipeline summary** — 6 stage cards (New → Quotation Sent) + Won/Lost callout strip at the top; each card is clickable to filter to that stage
- **Status tabs** — All / New / Contacted / Negotiation / Sample Sent / Quotation Sent / Won / Lost; count badges are always accurate because all 500 RFQs are fetched once and filtered client-side
- **Search** — real-time client-side match on `buyerName`, `companyName`, `email`, `productInterested`
- **Expandable rows** — click any row to reveal: buyer details grid, RFQ fields (qty, price, port, incoterm, packaging), custom requirements, inline status dropdown, admin notes textarea
- **Action buttons**: Save Changes (optimistic state update), Email (pre-filled `mailto:`), WhatsApp (`wa.me/` deep-link with product context), Delete
- **Refresh button** — quiet background reload without flashing skeleton

### Product Management (`/admin/products`)

- Filter tabs: All / Published / Draft
- Each row: 56px thumbnail, name, category, status badge, Globe/Eye/EyeOff/PenLine/Trash2 buttons
- Publish toggle: one-click PATCH to `/api/v1/products/${slug}` with `{ status }`, view live: opens `/products/${slug}`
- Edit: links to `/admin/products/${product._id}/edit`

### Product Form (new + edit)

8 sections:
1. **Basic Info** — name, category, status, short description, sample + private label checkboxes
2. **Product Details** — scientific name, HS code, origin, shelf life, lead time, MOQ
3. **Full Description** — HTML textarea
4. **Images** — `MultiImageUpload` component: click to upload, drag-to-remove, first image = main thumbnail; uploads directly to Supabase Storage
5. **Grades & Certifications** — comma-separated text inputs
6. **Technical Specifications** — dynamic `{label, value}[]` rows (Add Row / remove buttons)
7. **Packaging & Logistics** — packaging options (comma-separated), container capacity
8. **Export Information** — Incoterms toggle buttons, payment terms toggle buttons, export markets (comma-separated)

Name auto-generates slug via `slugify(name)` unless the slug field was manually edited (`slugEdited` flag).

---

## Blog System

Content is stored as raw **HTML**. Editor accepts standard HTML tags. A Preview toggle renders via `dangerouslySetInnerHTML` with Tailwind `prose` classes.

Cover images are uploaded directly to Supabase Storage via the `UploadInput` component.

Slug generation: `slugify(title)`. Collision handling: appends `-${Date.now()}`.

`publishedAt` is set automatically by the server when `status === "published"` — never set from the client.

---

## Authentication

```
POST /api/v1/auth/login
  → bcrypt.compare(password, user.passwordHash)
  → jwt.sign({ sub, email, role }, JWT_SECRET, { expiresIn })
  → Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/

Every /admin/* request
  → middleware.ts (Edge Runtime): jose.jwtVerify

Every admin API call
  → verifyToken(req): jsonwebtoken.verify
  → returns NextResponse (401) if invalid, or JWT payload if valid
  → callers check: if (auth instanceof NextResponse) return auth
```

### Two JWT libraries

| Context | Library | Reason |
|---|---|---|
| `middleware.ts` | `jose` | Edge Runtime (V8 isolate) — no Node.js crypto |
| API route handlers | `jsonwebtoken` | Node.js runtime — native crypto available |

---

## File Uploads

All file/image uploads use **Supabase Storage** via the `@supabase/ssr` client.

### Upload components

| Component | Location | Used in | Description |
|---|---|---|---|
| `MultiImageUpload` | `components/admin/MultiImageUpload.tsx` | Product new/edit | Accepts multiple files; grid preview with hover-to-remove; first = main thumbnail |
| `UploadInput` | `components/admin/UploadInput.tsx` | Blog, certifications, downloads | Single file or image; shows image preview or file card; Change/Remove buttons |

### Supabase utilities

| File | Purpose |
|---|---|
| `utils/supabase/client.ts` | `createClient()` for Client Components (`createBrowserClient`) |
| `utils/supabase/server.ts` | `createClient(cookieStore)` for Server Components / route handlers |
| `utils/supabase/middleware.ts` | `createClient(request)` for Next.js middleware context |
| `utils/supabase/storage.ts` | `SUPABASE_STORAGE_BUCKET` constant + `getUploadErrorMessage()` helper |

### Upload flow

```
User selects file(s) in upload component
  → createClient() (browser)
  → supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(path, file)
  → path: `${folder}/${Date.now()}-${random}.${ext}`
  → supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path)
  → returns publicUrl → stored in MongoDB as the image/file URL
```

Default bucket: `products` (set via `NEXT_PUBLIC_SUPABASE_BUCKET`).

---

## Redis Caching

Public content is cached in **Upstash Redis** using a cache-aside pattern. MongoDB is skipped entirely on cache hits.

### Cache layer — `utils/redis.ts`

```ts
export const CACHE_KEYS = {
  PRODUCTS_LIST: "v1:products:published",
  PRODUCT:       (slug: string) => `v1:product:${slug}`,
  BLOG_LIST:     "v1:blog:published",
  BLOG_POST:     (slug: string) => `v1:blog:${slug}`,
  CERTS_ACTIVE:  "v1:certs:active",
};
export const TTL = { LIST: 300, DETAIL: 600 };  // seconds
```

### What is cached

| Cache key | TTL | Invalidated by |
|---|---|---|
| `v1:products:published` | 5 min | Product create / update / delete |
| `v1:product:<slug>` | 10 min | Product update / delete for that slug |
| `v1:blog:published` | 5 min | Blog post create / update / delete |
| `v1:blog:<slug>` | 10 min | Blog post update / delete for that slug |
| `v1:certs:active` | 5 min | Certification create / update / delete |

### Server page data fetching

All public Server Components query MongoDB directly (no HTTP round-trip to own API) and use Redis as a read-through cache:

```ts
// Pattern used in app/products/page.tsx, app/blog/page.tsx, etc.
const cached = await cacheGet<T>(CACHE_KEYS.X);
if (cached) return cached;
await mongoDB();
const data = await Model.find(...).lean();
await cacheSet(CACHE_KEYS.X, data, TTL.LIST);
return data;
```

### Graceful degradation

If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are missing or Redis throws, all cache functions no-op. Pages continue to work by querying MongoDB directly.

---

## WhatsApp Integration

A floating sticky button component (`components/WhatsAppButton.tsx`) is added to `app/layout.tsx` and renders on every page. It reads `usePathname()` and hides itself on `/admin/*`, `/login`, `/register`, `/buyer` routes.

- WA number: `917330810209`
- Default message: `"Hi Sindhur Exports, I'm interested in importing from India..."`
- Positioned: `fixed bottom-6 right-6 z-50`
- Color: `#25D366` (WhatsApp brand green)

Product detail pages pre-fill the WA message with the specific product name:
```
"Hi Sindhur Exports, I'm interested in importing ${product.name} from India. Please send me a quote."
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas URI; database name: `syndhur-exports` |
| `JWT_SECRET` | HMAC secret for signing/verifying JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `JWT_COOKIE_MAX_AGE` | Cookie `maxAge` in seconds (e.g. `604800`) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (reserved — not yet wired in routes) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `30d`) |
| `BCRYPT_SALT_ROUNDS` | Bcrypt work factor (e.g. `12`) |
| `NEXT_PUBLIC_APP_URL` | Production URL for server-side API fetches (Server Components) |
| `NEXT_PUBLIC_APP_NAME` | App display name (e.g. `"Syndhur"`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | Storage bucket name (default: `products`) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_URL` | Public base URL for Supabase storage files |
| `BREVO_API_KEY` | Brevo (Sendinblue) API key — wired in `.env.local`, email routes not yet implemented |
| `BREVO_HOST` / `BREVO_PORT` / `BREVO_USER` / `BREVO_PASS` | Brevo SMTP credentials |
| `ZOHO_HOST` / `ZOHO_PORT` / `ZOHO_USER` / `ZOHO_PASS` | Zoho SMTP credentials (reserved) |
| `EMAIL_FROM` | Sender name/address for outbound email |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint — used by `utils/redis.ts` for caching |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token — required alongside `UPSTASH_REDIS_REST_URL` |

> **Before going live:** Set `NEXT_PUBLIC_APP_URL` to your production domain. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set — uploads will fail without them.

---

## Deployment

### Vercel (recommended)

```bash
vercel
```

Or push to GitHub and connect the repo to Vercel for automatic CI/CD. Copy all `.env.local` variables to Vercel's **Environment Variables** settings before deploying.

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
| Key stats | 50+ countries, 15+ years, 2000+ shipments, 98% on-time delivery |

### Products exported (6 categories)

| # | Product | Category |
|---|---|---|
| 1 | Fresh Coconuts | Agri Commodities |
| 2 | Coconut By-Products (oil, milk powder, desiccated) | Agri Commodities |
| 3 | Basmati & Non-Basmati Rice | Agri Commodities |
| 4 | Organic Dehydrated Powders (amla, moringa, turmeric…) | Organic Products |
| 5 | Spices & Masalas | Spices |
| 6 | Herbal & Botanical Extracts (ashwagandha, neem…) | Organic Products |
