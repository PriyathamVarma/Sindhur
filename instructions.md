# Sindhur Exports — AI Agent Reconstruction Guide

This document tells an AI agent everything needed to understand, reconstruct, or extend this project without reading every file. Read this before touching any code.

---

## What This Project Is

A **full-stack B2B export business platform** for "Sindhur Exports", a Visakhapatnam-based Indian export company. Three distinct surfaces:

1. **Public marketing site** — Single-page landing with sections: Hero, About, Products, Global Reach, Why Choose, Process, Testimonials, Contact.
2. **Public B2B pages** — Product catalog (`/products`, `/products/[slug]`), RFQ form (`/request-quote`), trust/certifications (`/trust`), download center (`/downloads`), blog (`/blog`, `/blog/[slug]`).
3. **Admin panel** — Password-protected dashboard at `/admin` for managing products, RFQ pipeline, certifications, downloads, download leads, legacy quote requests, and blog articles.

A floating WhatsApp button appears on all public pages.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Both marketing site and API |
| UI | React 19 | |
| Language | TypeScript 5 strict | |
| Styling | Tailwind CSS v4 | PostCSS plugin (`@tailwindcss/postcss`), `@import "tailwindcss"` |
| Database | MongoDB Atlas | Mongoose 9, db name: `syndhur-exports` |
| File storage | Supabase Storage | `@supabase/supabase-js` + `@supabase/ssr`; bucket: `products` |
| Auth | JWT in httpOnly cookies | bcryptjs + jsonwebtoken (API) + jose (middleware/Edge) |
| Middleware | Next.js Edge Middleware | `jose` `jwtVerify` (Edge Runtime compatible) |
| Fonts | Google Fonts via next/font | DM Sans (body, `--font-sans`), Playfair Display (headings, `--font-display`) |
| Icons | lucide-react (admin/auth) + inline SVGs (marketing) | |
| Toasts | react-hot-toast | `<Toaster position="top-right" />` in root layout |
| Slug util | Custom `slugify()` in `shared/lib/utils.tsx` | |

**Key `next.config.ts` setting:** `serverExternalPackages: ["mongoose"]` — prevents Next.js from bundling Mongoose. Also adds Supabase storage domain dynamically to `images.remotePatterns` via `getSupabaseHostname()`.

---

## Complete File Structure

```
Sindhur/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                        # Minimal: <div className="min-h-screen bg-gray-50 flex flex-col">
│   │   ├── login/page.tsx                    # Client: useSearchParams() inside <Suspense>; eye/EyeOff toggle; redirect to ?from
│   │   └── register/page.tsx                 # Client: password confirmation; redirect to /login on success
│   │
│   ├── admin/
│   │   ├── layout.tsx                        # Client: 8-item sidebar (desktop w-60, mobile slide-in overlay)
│   │   ├── page.tsx                          # Client: 8 stat cards, 4 quick actions, recent quotes list
│   │   ├── products/
│   │   │   ├── page.tsx                      # Client: product list, filter tabs, publish/unpublish, edit/delete
│   │   │   ├── new/page.tsx                  # Client: 8-section creation form, MultiImageUpload, dynamic spec rows, sticky save bar
│   │   │   └── [id]/edit/page.tsx            # Client: edit form; URL param = MongoDB _id; fetches product by id or slug
│   │   ├── rfq/page.tsx                      # Client: 8 status tabs, search bar, accordion rows, inline save
│   │   ├── certifications/page.tsx           # Client: list + fixed right slide-in panel for add/edit; UploadInput for image
│   │   ├── downloads/page.tsx                # Client: list + fixed right slide-in panel for add/edit; UploadInput for file; publish toggle
│   │   ├── download-leads/page.tsx           # Client: view-only paginated table, email mailto links, delete
│   │   ├── quotes/page.tsx                   # Client: filter tabs, expandable rows, inline status + notes update
│   │   └── blog/
│   │       ├── page.tsx                      # Client: post list, publish toggle, edit/delete
│   │       ├── new/page.tsx                  # Client: create post, auto-slug from title, HTML preview, UploadInput for cover
│   │       └── [id]/edit/page.tsx            # Client: edit post; URL uses MongoDB _id; PATCH uses slug; UploadInput for cover
│   │
│   ├── api/v1/
│   │   ├── utils/
│   │   │   ├── responses.tsx                 # success<T>() / failure<E>() — error field only in development
│   │   │   └── verifyToken.tsx               # reads "token" cookie; jsonwebtoken.verify(); returns NextResponse(401) or payload
│   │   ├── auth/
│   │   │   ├── login/route.tsx               # POST: bcrypt.compare → jwt.sign → Set-Cookie httpOnly
│   │   │   ├── register/route.tsx            # POST: duplicate check → bcrypt.hash → UserModel.create
│   │   │   ├── logout/route.tsx              # POST: Set-Cookie token="" maxAge=0
│   │   │   └── me/route.tsx                  # GET (JWT): UserModel.findById().select("-passwordHash")
│   │   ├── products/
│   │   │   ├── route.tsx                     # GET: public=published only; admin=true+JWT returns all; supports ?category, ?search, ?page, ?limit
│   │   │   │                                 # -fullDescription -specifications excluded from list projection
│   │   │   │                                 # POST (JWT): validate name+category+shortDescription+fullDescription; slugify(name); collision→slug-{Date.now()}
│   │   │   └── [slug]/route.tsx              # GET: ?admin=true skips published filter; full document
│   │   │                                     # PATCH (JWT): findOneAndUpdate({ slug }) $set body
│   │   │                                     # DELETE (JWT): findOneAndDelete({ slug })
│   │   ├── rfq/
│   │   │   ├── route.tsx                     # POST (no auth): validate buyerName+companyName+email+country+businessType+productInterested; create status="new"
│   │   │   │                                 # GET (JWT): paginated; filters ?status=, ?country=, ?product= (regex), ?search= (buyerName/companyName/email)
│   │   │   └── [id]/route.tsx                # PATCH (JWT): whitelist ["status","adminNotes"] only
│   │   │                                     # DELETE (JWT): findByIdAndDelete
│   │   ├── certifications/
│   │   │   ├── route.tsx                     # GET: public returns {status:"active"}; admin=true+JWT returns all
│   │   │   │                                 # POST (JWT): requires name + issuingAuthority
│   │   │   └── [id]/route.tsx                # PATCH (JWT) + DELETE (JWT)
│   │   ├── downloads/
│   │   │   ├── route.tsx                     # GET: public returns published; admin=true+JWT returns all
│   │   │   │                                 # POST (JWT): requires title+description+fileUrl+type
│   │   │   └── [id]/route.tsx                # PATCH (JWT) + DELETE (JWT)
│   │   ├── download-leads/
│   │   │   ├── route.tsx                     # POST (no auth): validate name+email+downloadId; looks up DownloadModel.findById(downloadId)
│   │   │   │                                 # creates lead; RETURNS { lead, fileUrl: download.fileUrl } — used by frontend to trigger download
│   │   │   │                                 # GET (JWT): paginated list of all leads
│   │   │   └── [id]/route.tsx                # DELETE (JWT) only
│   │   ├── quotes/
│   │   │   ├── route.tsx                     # POST (no auth): validate name+email; GET (JWT): paginated ?status=
│   │   │   └── [id]/route.tsx                # PATCH (JWT): status/adminNotes only; DELETE (JWT)
│   │   ├── blog/
│   │   │   ├── route.tsx                     # GET: ?admin=true needs JWT; -content projection always; ?tag=, ?page=, ?limit=
│   │   │   │                                 # POST (JWT): slugify(title), collision→slug-{Date.now()}, sets publishedAt if published
│   │   │   └── [slug]/route.tsx              # GET: ?admin=true skips published filter
│   │   │                                     # PATCH (JWT): any fields; sets publishedAt on publish
│   │   │                                     # DELETE (JWT): findOneAndDelete({ slug })
│   │   └── admin/
│   │       └── stats/route.tsx               # GET (JWT): Promise.all 11 queries → quotes, blog, rfq, downloadLeads counts + 5 recent quotes
│   │
│   ├── products/
│   │   ├── page.tsx                          # Server Component: getProducts() → passes to <ProductCatalog initialProducts={...} />
│   │   ├── [slug]/page.tsx                   # Server Component: generateMetadata + full product layout
│   │   │                                     # Two-column: left=<ProductGallery />, right=info panel
│   │   │                                     # Sections: specs table, packaging, export info, bottom CTA banner
│   │   │                                     # WA pre-fill: "...I'm interested in importing ${product.name}..."
│   │   │                                     # RFQ link: /request-quote?product=${encodeURIComponent(product.name)}
│   │   └── [slug]/edit/page.tsx              # Server: redirect shim → /admin/products/${slug}/edit
│   ├── request-quote/page.tsx                # Client: useSearchParams() in Suspense; pre-fills productInterested from ?product=
│   │                                         # 3 sections: About You, Product Requirements, Additional Details
│   │                                         # Sidebar: "What Happens Next?" + WA/email links
│   ├── trust/page.tsx                        # Server: fetches /api/v1/certifications (dynamic); static STATIC_CERTS[] + QUALITY_STEPS[]
│   │                                         # Sections: hero → DB certs grid → static regulatory → QA process → stats → CTA
│   ├── downloads/page.tsx                    # Client: fetches /api/v1/downloads; TYPE_COLORS + TYPE_ICONS maps
│   │                                         # Gated: shows modal → POST /api/v1/download-leads → receives fileUrl → window.open
│   │                                         # Non-gated: direct window.open(item.fileUrl)
│   ├── blog/
│   │   ├── page.tsx                          # Server Component: fetch /api/v1/blog, render published grid
│   │   └── [slug]/page.tsx                   # Server Component: generateMetadata + full post with prose classes
│   │
│   ├── layout.tsx                            # Root: fonts, UserProvider, Toaster, <WhatsAppButton /> (inside UserProvider)
│   ├── page.tsx                              # Homepage: all section components + SEO metadata export
│   └── globals.css                           # @import "tailwindcss"; @theme inline {}; @theme {} color tokens
│
├── components/
│   ├── admin/
│   │   ├── MultiImageUpload.tsx              # Client: multi-image upload grid → Supabase Storage
│   │   │                                     # Props: { values: string[], onChange: (urls: string[]) => void, folder?: string }
│   │   │                                     # Uploads multiple files; 2-3 col grid; hover X to remove; first = MAIN badge
│   │   └── UploadInput.tsx                   # Client: single file/image upload → Supabase Storage
│   │                                         # Props: { value, onChange, folder?, accept?, label?, hint? }
│   │                                         # Shows image preview or file card; Change/Remove buttons; drop zone when empty
│   ├── Navbar.tsx                            # Client: scroll threshold 40px, mobile hamburger, Admin link hardcoded (not in NAV_LINKS)
│   ├── HeroSection.tsx                       # Client: useRef for parallax scroll
│   ├── AboutSection.tsx                      # Server: story text, CERTIFICATIONS[], image collage, floating award card
│   ├── ProductsSection.tsx                   # Server: static 6-card grid from PRODUCTS[] (homepage only)
│   ├── ProductCatalog.tsx                    # Client: props { initialProducts: IProduct[] }; useState search + activeCategory
│   │                                         # useMemo for categories list and filtered products
│   │                                         # ProductCard sub-component: image, category badge, name, desc, cert tags, MOQ, sample badge
│   │                                         # Bottom CTA section for custom sourcing
│   ├── ProductGallery.tsx                    # Client: props { images: string[], name: string }; useState(0) for active index
│   │                                         # Prev/next arrows, thumbnail strip, image counter overlay
│   │                                         # Falls back to Unsplash placeholder if images is empty
│   ├── WhatsAppButton.tsx                    # Client: usePathname() to hide on /admin/*, /login, /register, /buyer
│   │                                         # WA number: 917330810209; fixed bottom-6 right-6 z-50; color #25D366
│   ├── GlobalSection.tsx                     # Server: COUNTRIES[] grouped by region
│   ├── WhyChooseSection.tsx                  # Server: sticky left panel + scrolling 2-col card grid
│   ├── ProcessSection.tsx                    # Server: 5-step PROCESS_STEPS[] timeline
│   ├── TestimonialsSection.tsx               # Server: 3 TESTIMONIALS[] cards + brand certification strip
│   ├── ContactSection.tsx                    # Client: fetch POST /api/v1/quotes; toast feedback
│   └── Footer.tsx                            # Server: FOOTER_LINKS{}, SOCIAL_LINKS[], CERTIFICATIONS[], copyright with Visakhapatnam
│
├── utils/
│   └── supabase/
│       ├── client.ts                         # createBrowserClient() — import in Client Components
│       ├── server.ts                         # createServerClient(cookieStore) — import in Server Components / API routes
│       ├── middleware.ts                     # createClient(request) — import in Next.js middleware context
│       └── storage.ts                       # SUPABASE_STORAGE_BUCKET (from env, default "products")
│                                             # getUploadErrorMessage(err: unknown): string
│
├── shared/
│   ├── context/
│   │   └── UserContext.tsx                   # useUser(); ILoggedinUser { id, name?, email, role? }
│   │                                         # localStorage key: "se_user" (not "user")
│   │                                         # On mount: rehydrate from /api/v1/auth/me if no user in state
│   ├── interfaces/mongodb/
│   │   ├── users/user.tsx                    # IUser, UserRole = "Admin"
│   │   ├── quotes/quoteRequest.tsx           # IQuoteRequest, QuoteStatus = "pending"|"reviewing"|"responded"|"closed"
│   │   ├── blog/blogPost.tsx                 # IBlogPost, PostStatus = "draft"|"published"
│   │   ├── products/product.tsx              # IProduct, IProductSpecification, ProductStatus = "draft"|"published"
│   │   ├── rfq/rfq.tsx                       # IRFQ, RFQStatus = "new"|"contacted"|"negotiation"|"sample_sent"|"quotation_sent"|"won"|"lost"
│   │   │                                     # BusinessType = "Importer"|"Distributor"|"Retailer"|"Wholesaler"|"Manufacturer"|"Other"
│   │   ├── certifications/certification.tsx  # ICertification, CertificationStatus = "active"|"expired"|"hidden"
│   │   ├── downloads/download.tsx            # IDownload, DownloadType, DownloadStatus = "draft"|"published"
│   │   └── downloads/downloadLead.tsx        # IDownloadLead
│   ├── lib/
│   │   ├── db/mongo.tsx                      # mongoDB() singleton — globalThis._mongoCache pattern
│   │   └── utils.tsx                         # cx(...args), slugify(text), formatDate(date) [en-IN locale]
│   └── models/mongodb/
│       ├── users/user.tsx                    # mongoose.models.User || mongoose.model("User", userSchema)
│       ├── quotes/quoteRequest.tsx           # QuoteRequestModel
│       ├── blog/blogPost.tsx                 # BlogPostModel
│       ├── products/product.tsx              # ProductModel — nested specSchema = new Schema({label,value}, {_id:false})
│       ├── rfq/rfq.tsx                       # RFQModel
│       ├── certifications/certification.tsx  # CertificationModel
│       ├── downloads/download.tsx            # DownloadModel — DownloadType enum on schema
│       └── downloads/downloadLead.tsx        # DownloadLeadModel
│
├── lib/
│   └── data.ts                               # NAV_LINKS (Products → /products now, not #products), PRODUCTS[], etc.
├── types/
│   └── index.ts                              # Product, Testimonial, ProcessStep, WhyChooseItem, Country, NavLink
│
├── middleware.ts                             # Edge Runtime: jose jwtVerify protects /admin/:path*; redirects to /login?from=
├── proxy.ts                                  # Standalone JWT proxy utility — same logic as middleware but importable
├── next.config.ts                            # serverExternalPackages: ["mongoose"], image remotePatterns (Unsplash + Supabase dynamic)
├── tsconfig.json                             # strict, paths: { "@/*": ["./*"] }
├── postcss.config.mjs                        # plugins: { "@tailwindcss/postcss": {} }
├── package.json                              # runtime deps (see below)
└── .env.local                                # Secrets — NEVER commit
```

---

## Runtime Dependencies

```json
{
  "@supabase/ssr": "^0.12.0",
  "@supabase/supabase-js": "^2.108.2",
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

### Public RFQ submission

```
User fills /request-quote (Client Component, Suspense-wrapped)
  → URL param ?product= pre-fills productInterested field
  → POST /api/v1/rfq { buyerName, companyName, email, phone?, country, businessType,
                       productInterested, quantityRequired?, targetPrice?, preferredIncoterm?,
                       destinationPort?, packagingRequirements?, customRequirements?, message? }
  → validates required fields; creates with status: "new"
  → MongoDB collection: rfqs
  → Admin views at /admin/rfq via GET /api/v1/rfq (JWT required)
  → Admin changes status (new→contacted→negotiation→sample_sent→quotation_sent→won/lost)
  → PATCH /api/v1/rfq/[id] { status, adminNotes } — only these two fields updatable
```

### Product catalog (hybrid SSR + client filtering)

```
/products page (Server Component)
  → getProducts() fetches ${NEXT_PUBLIC_APP_URL}/api/v1/products?limit=100
  → returns IProduct[] (published only, no fullDescription or specifications)
  → renders <ProductCatalog initialProducts={products} />

ProductCatalog.tsx (Client Component)
  → useMemo derives categories list from initialProducts
  → useState for search and activeCategory
  → filters products client-side — NO additional fetches
  → renders ProductCard grid

/products/[slug] page (Server Component)
  → getProduct(slug) fetches ${NEXT_PUBLIC_APP_URL}/api/v1/products/${slug}
  → returns full product including specifications
  → generateMetadata() runs same fetch for SEO title/description/og
  → renders: breadcrumb, ProductGallery (Client), info panel, specs table, CTA
```

### Supabase file upload flow

```
Admin opens product form (new or edit)
  → <MultiImageUpload values={form.images} onChange={...} folder="products/images" />
  → User clicks "Add image" or drag area
  → FileList → for each file:
      path = `products/images/${Date.now()}-${random}.${ext}`
      supabase.storage.from("products").upload(path, file)
      supabase.storage.from("products").getPublicUrl(path) → publicUrl
  → publicUrl appended to form.images[]
  → On save: images[] stored in MongoDB as IProduct.images

Same pattern for UploadInput (single file):
  → certifications: imageUrl / documentUrl fields
  → downloads: fileUrl field
  → blog: coverImage field
```

### Gated download flow

```
/downloads page (Client Component)
  → useEffect: fetch /api/v1/downloads (published only)
  → renders download cards with TYPE_COLORS and TYPE_ICONS

Non-gated download (requiresLeadCapture: false)
  → onClick: window.open(item.fileUrl, '_blank')

Gated download (requiresLeadCapture: true)
  → onClick: open modal with name/email/company/country fields
  → submit: POST /api/v1/download-leads { name, email, company?, country?, phone?, downloadId }
  → server: looks up DownloadModel.findById(downloadId), creates lead record
  → server response: { success: true, data: { lead, fileUrl: download.fileUrl } }
  → frontend: window.open(data.fileUrl, '_blank')
  → fileUrl is NOT exposed before lead capture — only returned after successful POST
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
  → jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  → invalid/missing → NextResponse.redirect("/login?from=<pathname>")

Every admin API call
  → verifyToken(req) in route handler (Node.js runtime)
  → jsonwebtoken.verify(token, JWT_SECRET)
  → returns NextResponse(401) if invalid, or JWT payload if valid
  → callers: if (auth instanceof NextResponse) return auth

Logout
  → UserContext.logout()
  → clears localStorage "se_user"
  → POST /api/v1/auth/logout → Set-Cookie: token=""; Max-Age=0
```

### Product admin edit (two-fetch pattern)

```
/admin/products/[id]/edit (URL param = MongoDB _id)
  → fetch /api/v1/products/${id}?admin=true  (uses _id or slug as the path param)
  → pre-fill form with full data
  → PATCH /api/v1/products/${product.slug} (NOT by _id — API is slug-keyed)
```

---

## MongoDB Schemas

**CRITICAL:** Do NOT use `new Schema<IType>()` generics — causes TypeScript errors because interfaces use `string` but Mongoose uses `ObjectId` internally. Use plain `new Schema({...})`.

Always use `mongoose.models.X || mongoose.model("X", schema)` to prevent re-registration on hot-reload.

### User (collection: `users`)
```
name: String, required, trim
email: String, required, unique, lowercase, trim
passwordHash: String, required
role: String, enum ["Admin"], default "Admin"
timestamps: true
```

### QuoteRequest (collection: `quoterequests`)
```
name, email: required; company?, country?, product?, message?, adminNotes?
status: enum ["pending","reviewing","responded","closed"], default "pending"
indexes: { status: 1 }, { createdAt: -1 }, { status: 1, createdAt: -1 }
```

### BlogPost (collection: `blogposts`)
```
title, slug, excerpt, content: required; coverImage?, tags: [String], authorId?
slug: unique, indexed
status: enum ["draft","published"], default "draft"
publishedAt: Date (auto-set by server on publish)
indexes: { slug: 1 unique }, { status: 1 }, { status: 1, publishedAt: -1 }
```

### Product (collection: `products`)
```
name, slug, category, shortDescription, fullDescription: required
slug: unique, indexed
images: [String]  ← Supabase Storage public URLs
specifications: [specSchema], availableGrades: [String]
packagingOptions: [String], certifications: [String]
incotermsSupported: [String], paymentTerms: [String], exportMarkets: [String]
privateLabelAvailable: Boolean default false
sampleAvailable: Boolean default false
status: enum ["draft","published"], default "draft"
specSchema: new Schema({ label: String, value: String }, { _id: false })
indexes: { status: 1, createdAt: -1 }, { category: 1, status: 1 }
```

### RFQ (collection: `rfqs`)
```
buyerName, companyName, email, country, businessType, productInterested: required
phone?, quantityRequired?, targetPrice?, destinationPort?, preferredIncoterm?
packagingRequirements?, customRequirements?, message?, uploadedDocumentUrl?, adminNotes?
status: enum ["new","contacted","negotiation","sample_sent","quotation_sent","won","lost"], default "new"
indexes: { createdAt: -1 }, { status: 1, createdAt: -1 }, { country: 1 }
```

### Certification (collection: `certifications`)
```
name, issuingAuthority: required
certificateNumber?, validFrom?: Date, validTo?: Date
imageUrl?, documentUrl?, description?   ← both can be Supabase Storage URLs
status: enum ["active","expired","hidden"], default "active"
indexes: { status: 1 }
```

### Download (collection: `downloads`)
```
title, description, fileUrl, type: required
fileUrl  ← Supabase Storage public URL
type: enum ["Company Profile","Product Catalog","Certification","Brochure","Other"]
requiresLeadCapture: Boolean default false
status: enum ["draft","published"], default "published"
indexes: { status: 1 }, { type: 1 }
```

### DownloadLead (collection: `downloadleads`)
```
name, email, downloadId, downloadTitle: required
company?, country?, phone?
downloadId: String (references Download._id as string)
downloadTitle: String (denormalised for admin display)
indexes: { downloadId: 1 }, { createdAt: -1 }
```

---

## Interfaces

### `IProduct` — `shared/interfaces/mongodb/products/product.tsx`

```ts
export type ProductStatus = "draft" | "published";
export interface IProductSpecification { label: string; value: string; }
export interface IProduct {
  _id?: string; name: string; slug: string; category: string;
  shortDescription: string; fullDescription: string; images: string[];
  scientificName?: string; hsCode?: string; origin?: string;
  availableGrades: string[]; specifications: IProductSpecification[];
  moq?: string; packagingOptions: string[]; containerCapacity?: string;
  shelfLife?: string; certifications: string[]; leadTime?: string;
  incotermsSupported: string[]; paymentTerms: string[]; exportMarkets: string[];
  privateLabelAvailable: boolean; sampleAvailable: boolean;
  status: ProductStatus; createdAt?: Date; updatedAt?: Date;
}
```

### `IRFQ` — `shared/interfaces/mongodb/rfq/rfq.tsx`

```ts
export type RFQStatus = "new"|"contacted"|"negotiation"|"sample_sent"|"quotation_sent"|"won"|"lost";
export type BusinessType = "Importer"|"Distributor"|"Retailer"|"Wholesaler"|"Manufacturer"|"Other";
export interface IRFQ {
  _id?: string; buyerName: string; companyName: string; email: string; phone?: string;
  country: string; businessType: BusinessType; productInterested: string;
  quantityRequired?: string; targetPrice?: string; destinationPort?: string;
  preferredIncoterm?: string; packagingRequirements?: string; customRequirements?: string;
  message?: string; uploadedDocumentUrl?: string; status: RFQStatus; adminNotes?: string;
  createdAt?: Date; updatedAt?: Date;
}
```

### `ICertification` — `shared/interfaces/mongodb/certifications/certification.tsx`

```ts
export type CertificationStatus = "active" | "expired" | "hidden";
export interface ICertification {
  _id?: string; name: string; issuingAuthority: string; certificateNumber?: string;
  validFrom?: Date; validTo?: Date; imageUrl?: string; documentUrl?: string;
  description?: string; status: CertificationStatus; createdAt?: Date; updatedAt?: Date;
}
```

### `IDownload` — `shared/interfaces/mongodb/downloads/download.tsx`

```ts
export type DownloadType = "Company Profile"|"Product Catalog"|"Certification"|"Brochure"|"Other";
export type DownloadStatus = "draft" | "published";
export interface IDownload {
  _id?: string; title: string; description: string; fileUrl: string;
  type: DownloadType; requiresLeadCapture: boolean; status: DownloadStatus;
  createdAt?: Date; updatedAt?: Date;
}
```

### `IDownloadLead` — `shared/interfaces/mongodb/downloads/downloadLead.tsx`

```ts
export interface IDownloadLead {
  _id?: string; name: string; email: string; company?: string; country?: string;
  phone?: string; downloadId: string; downloadTitle: string; createdAt?: Date; updatedAt?: Date;
}
```

### `IUser`, `IQuoteRequest`, `IBlogPost`, `ILoggedinUser`

```ts
// IUser
export type UserRole = "Admin";
export interface IUser { _id?: string; name: string; email: string; passwordHash: string; role: UserRole; createdAt?: Date; updatedAt?: Date; }

// IQuoteRequest
export type QuoteStatus = "pending"|"reviewing"|"responded"|"closed";
export interface IQuoteRequest { _id?: string; name: string; company?: string; email: string; country?: string; product?: string; message?: string; status: QuoteStatus; adminNotes?: string; createdAt?: Date; updatedAt?: Date; }

// IBlogPost
export type PostStatus = "draft"|"published";
export interface IBlogPost { _id?: string; title: string; slug: string; excerpt: string; content: string; coverImage?: string; tags: string[]; status: PostStatus; authorId?: string; publishedAt?: Date; createdAt?: Date; updatedAt?: Date; }

// ILoggedinUser (UserContext)
export interface ILoggedinUser { id: string; name?: string; email: string; role?: string; }
```

---

## API Response Contract

All responses use typed helpers from `app/api/v1/utils/responses.tsx`:

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
| GET | `/api/v1/auth/me` | JWT | — | Returns user minus `passwordHash` |
| GET | `/api/v1/products` | — / JWT | `?admin=true&category=&search=&page=&limit=` | List excludes `fullDescription` + `specifications` |
| POST | `/api/v1/products` | JWT | `{ name, category, shortDescription, fullDescription, ...rest }` | Auto-generates slug |
| GET | `/api/v1/products/[slug]` | — / JWT | `?admin=true` | Full document including specifications |
| PATCH | `/api/v1/products/[slug]` | JWT | any `IProduct` fields | `findOneAndUpdate({ slug })` |
| DELETE | `/api/v1/products/[slug]` | JWT | — | `findOneAndDelete({ slug })` |
| POST | `/api/v1/rfq` | — | `{ buyerName, companyName, email, country, businessType, productInterested, ...rest }` | Creates with `status: "new"` |
| GET | `/api/v1/rfq` | JWT | `?status=&country=&product=&search=&page=&limit=` | `product` is regex on `productInterested` |
| PATCH | `/api/v1/rfq/[id]` | JWT | `{ status?, adminNotes? }` | Only these two fields |
| DELETE | `/api/v1/rfq/[id]` | JWT | — | `findByIdAndDelete` |
| GET | `/api/v1/certifications` | — / JWT | `?admin=true` | Public: active only |
| POST | `/api/v1/certifications` | JWT | `{ name, issuingAuthority, ...rest }` | |
| PATCH | `/api/v1/certifications/[id]` | JWT | any `ICertification` fields | |
| DELETE | `/api/v1/certifications/[id]` | JWT | — | |
| GET | `/api/v1/downloads` | — / JWT | `?admin=true` | Public: published only |
| POST | `/api/v1/downloads` | JWT | `{ title, description, fileUrl, type, ...rest }` | |
| PATCH | `/api/v1/downloads/[id]` | JWT | any `IDownload` fields | |
| DELETE | `/api/v1/downloads/[id]` | JWT | — | |
| POST | `/api/v1/download-leads` | — | `{ name, email, company?, country?, phone?, downloadId }` | Returns `{ lead, fileUrl }` |
| GET | `/api/v1/download-leads` | JWT | `?page=&limit=` | Paginated |
| DELETE | `/api/v1/download-leads/[id]` | JWT | — | |
| POST | `/api/v1/quotes` | — | `{ name, email, company?, country?, product?, message? }` | Legacy form; creates `status: "pending"` |
| GET | `/api/v1/quotes` | JWT | `?status=&page=&limit=` | |
| PATCH | `/api/v1/quotes/[id]` | JWT | `{ status?, adminNotes? }` | |
| DELETE | `/api/v1/quotes/[id]` | JWT | — | |
| GET | `/api/v1/blog` | — / JWT | `?admin=true&tag=&page=&limit=` | `-content` projection always |
| POST | `/api/v1/blog` | JWT | `{ title, excerpt, content, coverImage?, tags?, status? }` | Auto slug |
| GET | `/api/v1/blog/[slug]` | — / JWT | `?admin=true` | Full content |
| PATCH | `/api/v1/blog/[slug]` | JWT | any `IBlogPost` fields | Sets `publishedAt` if publishing |
| DELETE | `/api/v1/blog/[slug]` | JWT | — | |
| GET | `/api/v1/admin/stats` | JWT | — | `{ quotes, blog, rfq: {total,new,won}, downloadLeads: {total}, recentQuotes }` |

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

- `--font-sans` = DM Sans — body text, UI components
- `--font-display` = Playfair Display — marketing headings (`font-[family-name:var(--font-display)]`)

### Section background alternation (homepage)

```
Hero (bg-gray-950) → About (bg-white) → Products (bg-gray-50) → Global (bg-gray-950)
→ WhyChoose (bg-white) → Process (bg-gray-50) → Testimonials (bg-white) → Contact (bg-gray-50)
→ Footer (bg-gray-950)
```

---

## Key Behaviours Agents Must Know

### Navbar Admin link

The Admin link (`href="/admin"`) is **hardcoded** in `Navbar.tsx`, not in `NAV_LINKS` in `lib/data.ts`. Intentional — it renders with a distinct bordered style. The mobile hamburger does NOT show the Admin link.

### Login page and `useSearchParams`

`app/(auth)/login/page.tsx` uses `useSearchParams()` inside an inner component, which requires a `<Suspense>` boundary. The outer default export wraps the inner Client Component in `<Suspense>`. Same pattern applies to `app/request-quote/page.tsx` (uses `useSearchParams()` for `?product=` pre-fill).

### Blog + product edit: \_id in URL vs slug in API

Both `/admin/blog/[id]/edit` and `/admin/products/[id]/edit` use MongoDB `_id` in the URL. There are no single-resource-by-id API endpoints. Both pages:
1. Fetch the full item directly (blog: by `_id`, products: by `_id` used as the API path param)
2. PATCH by slug

### MongoDB singleton

`shared/lib/db/mongo.tsx` uses `globalThis._mongoCache` to prevent multiple connections on hot-reload:

```ts
declare global { var _mongoCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }; }
const cache = globalThis._mongoCache ?? { conn: null, promise: null };
globalThis._mongoCache = cache;
```

### Slug uniqueness on creation (products and blog)

```ts
let slug = slugify(name);  // or slugify(title) for blog
const exists = await Model.findOne({ slug });
if (exists) slug = `${slug}-${Date.now()}`;
```

### verifyToken return type

```ts
const auth = await verifyToken(req);
if (auth instanceof NextResponse) return auth;
// auth is now the JWT payload — use auth.sub as user ID
```

### Products list API excludes heavy fields

`GET /api/v1/products` always projects out `-fullDescription -specifications` for performance. To get specifications (needed for edit form and product detail page), always fetch the single-product endpoint `/api/v1/products/[slug]`.

### Download lead capture returns fileUrl

`POST /api/v1/download-leads` looks up the Download document by `downloadId` and returns `fileUrl` in the response. The frontend never sees the file URL before submitting the lead form — it's only returned after a successful POST.

### WhatsApp button hiding

`components/WhatsAppButton.tsx` uses `usePathname()` and returns `null` for any route that starts with `/admin`, `/login`, `/register`, or `/buyer`. It is mounted inside `UserProvider` in `app/layout.tsx`.

### Product form auto-slug

In `/admin/products/new/page.tsx`, changing the name field calls `slugify(name)` and auto-updates the slug input — UNLESS the user has manually edited the slug field (tracked with a `slugEdited: boolean` state flag). Once manually edited, auto-update stops.

### Admin sidebar active state

```ts
const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
```

The `/admin` root is an exact match only — otherwise every admin page would highlight the Dashboard.

### Supabase upload path convention

Upload components receive a `folder` prop. Use descriptive, consistent folder names:
- Product images → `folder="products/images"` (default for MultiImageUpload in product forms)
- Blog cover images → `folder="blog/covers"`
- Certification images → `folder="certifications"`
- Download files → `folder="downloads"`

The bucket is always `SUPABASE_STORAGE_BUCKET` (default: `"products"`).

### next.config.ts image remotePatterns

Supabase hostname is derived dynamically from `NEXT_PUBLIC_SUPABASE_URL` via `getSupabaseHostname()`. Fallback hostname: `oresprkgtglnhbiyqlzs.supabase.co`. Allowed path: `/storage/v1/object/public/**`.

### `/products/[slug]/edit` redirect

`app/products/[slug]/edit/page.tsx` is a Server Component that calls `redirect("/admin/products/${slug}/edit")`. It exists for convenience — links that land on the public product URL + `/edit` are forwarded to the admin panel.

---

## Products (6 static — `lib/data.ts`)

These are the homepage marketing cards in `PRODUCTS[]`. Separate from the MongoDB Product catalog at `/products`.

| Title | Category |
|---|---|
| Fresh Coconuts | Agri Commodities |
| Coconut By-Products | Agri Commodities |
| Basmati & Non-Basmati Rice | Agri Commodities |
| Organic Dehydrated Powders | Organic Products |
| Spices & Masalas | Spices |
| Herbal & Botanical Extracts | Organic Products |

**NAV_LINKS** in `lib/data.ts`: Products href is `/products` (links to catalog page), not `#products` (old anchor).

---

## What Does NOT Exist — Avoid Hallucinating

- No `/api/v2/` routes
- No `/api/v1/products/[id]` route — product API is slug-based, not id-based
- No `/api/v1/rfq/[id]` GET — no single RFQ fetch by id
- No `/api/v1/certifications/[id]` GET — no single cert fetch
- No rate limiting (Redis/Upstash credentials in `.env.local` but zero wiring)
- No email notifications (Brevo/Zoho credentials configured but no mailer implemented)
- No roles beyond `"Admin"` (no Buyer, Manager, Farmer)
- No `src/` directory — all files at project root
- No Storybook, Jest, Playwright, or test files
- No i18n / locale routing
- No dark mode toggle
- No `/api/v1/blog/[id]` endpoint — blog API is slug-based only
- No BullMQ workers or background jobs (Upstash credentials present but no queue wiring)
- No CI/CD configuration (no `.github/workflows/`, no Dockerfile)
- The mobile Navbar does NOT include the Admin link (desktop-only)
- The `/api/v1/blog` list endpoint always omits `content` — never returns full HTML in lists
- AI export assistant was explicitly NOT implemented
- No JWT refresh token flow implemented — `JWT_REFRESH_SECRET` and `JWT_REFRESH_EXPIRES_IN` are in `.env.local` but not wired in any route

---

## Environment Variables (`.env.local`)

| Variable | Used In |
|---|---|
| `MONGODB_URI` | `shared/lib/db/mongo.tsx` |
| `JWT_SECRET` | `middleware.ts` (jose), `verifyToken.tsx` (jsonwebtoken), login route |
| `JWT_EXPIRES_IN` | login route — `jwt.sign(payload, secret, { expiresIn })` |
| `JWT_COOKIE_MAX_AGE` | login route — `Set-Cookie Max-Age` in seconds (e.g. `604800` = 7 days) |
| `JWT_REFRESH_SECRET` | Reserved — not yet wired in any route |
| `JWT_REFRESH_EXPIRES_IN` | Reserved — not yet wired in any route |
| `BCRYPT_SALT_ROUNDS` | register route — `bcrypt.hash(password, rounds)` |
| `NEXT_PUBLIC_APP_URL` | Server Components — `fetch(`${NEXT_PUBLIC_APP_URL}/api/v1/...`)` |
| `NEXT_PUBLIC_APP_NAME` | App display name (e.g. `"Syndhur"`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `utils/supabase/client.ts`, `server.ts`, `middleware.ts` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same as above — Supabase anon key |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | `utils/supabase/storage.ts` — storage bucket name |
| `NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_URL` | Public base URL for storage files (informational) |
| `BREVO_*` | Email SMTP (Brevo/Sendinblue) — credentials present, no mailer wired |
| `ZOHO_*` | Zoho SMTP — credentials present, not wired |
| `EMAIL_FROM` | Sender name/address for future email feature |
| `REDIS_URL` / `UPSTASH_*` | Rate limiting — credentials present, not yet wired |

> **Before going live:** Set `NEXT_PUBLIC_APP_URL` to the production domain. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set — uploads fail without them.

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
