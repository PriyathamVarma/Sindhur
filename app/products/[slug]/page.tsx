import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import { mongoDB } from "@/shared/lib/db/mongo";
import ProductModel from "@/shared/models/mongodb/products/product";
import type { IProduct } from "@/shared/interfaces/mongodb/products/product";
import { cacheGet, cacheSet, CACHE_KEYS, TTL } from "@/utils/redis";

async function getProduct(slug: string): Promise<IProduct | null> {
  const key    = CACHE_KEYS.PRODUCT(slug);
  const cached = await cacheGet<IProduct>(key);
  if (cached) return cached;

  try {
    await mongoDB();
    const product = await ProductModel.findOne({ slug, status: "published" }).lean();
    if (!product) return null;
    const result = product as unknown as IProduct;
    await cacheSet(key, result, TTL.DETAIL);
    return result;
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found — Sindhur Exports" };
  return {
    title:       `${product.name} — Sindhur Exports`,
    description: product.shortDescription,
    keywords:    [product.category, ...product.certifications],
    openGraph: {
      title:       product.name,
      description: product.shortDescription,
      images:      product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

const WA_NUMBER = "917330810209";

function StatCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-orange-600">{icon}</span>
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-bold text-gray-900 text-[14px] leading-snug mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const waMsg = encodeURIComponent(
    `Hi Sindhur Exports, I'm interested in importing ${product.name} from India. Please send me a quote.`
  );

  const stats: { icon: React.ReactNode; label: string; value: string }[] = [
    product.origin          && { icon: <IconPin />,      label: "Origin",            value: product.origin },
    product.hsCode          && { icon: <IconHash />,     label: "HS Code",           value: product.hsCode },
    product.moq             && { icon: <IconBox />,      label: "Min. Order (MOQ)",  value: product.moq },
    product.leadTime        && { icon: <IconClock />,    label: "Lead Time",         value: product.leadTime },
    product.shelfLife       && { icon: <IconCalendar />, label: "Shelf Life",        value: product.shelfLife },
    product.containerCapacity && { icon: <IconShip />,   label: "Container",         value: product.containerCapacity },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="bg-white">

      {/* ── Dark header + breadcrumb ─────────────────────────────────────── */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] text-gray-500 mb-5">
            <a href="/" className="hover:text-orange-400 transition">Home</a>
            <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <a href="/products" className="hover:text-orange-400 transition">Products</a>
            <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-300 font-medium truncate">{product.name}</span>
          </nav>

          {/* Title block */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                {product.name}
              </h1>
              {product.scientificName && (
                <p className="mt-1.5 text-gray-500 text-[14px] italic">{product.scientificName}</p>
              )}
            </div>
            {/* Quick trust pills */}
            <div className="flex flex-wrap gap-2 self-end">
              {product.sampleAvailable && (
                <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Sample Available
                </span>
              )}
              {product.privateLabelAvailable && (
                <span className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Private Label
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 2-col layout ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-10 lg:gap-14 items-start">

          {/* Left — Gallery + body content */}
          <div className="space-y-10">
            <ProductGallery images={product.images} name={product.name} />

            {/* Short description below gallery on mobile, hidden on desktop */}
            <p className="text-gray-600 text-[16px] leading-relaxed lg:hidden">{product.shortDescription}</p>

            {/* Full Description */}
            {product.fullDescription && (
              <div>
                <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Product Overview</h2>
                <div
                  className="prose prose-gray max-w-none
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-3
                    prose-headings:font-black prose-headings:text-gray-900
                    prose-h2:text-xl prose-h3:text-lg
                    prose-strong:text-gray-800
                    prose-ul:my-3 prose-li:text-gray-600 prose-li:my-1
                    prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                />
              </div>
            )}

            {/* Technical Specifications */}
            {product.specifications?.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Technical Specifications</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-[180px_1fr] bg-gray-950 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <div className="px-5 py-3">Parameter</div>
                    <div className="px-5 py-3 border-l border-gray-800">Value</div>
                  </div>
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-[180px_1fr] ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"} border-t border-gray-100`}
                    >
                      <div className="px-5 py-3.5 text-[13px] font-semibold text-gray-600 border-r border-gray-100">
                        {spec.label}
                      </div>
                      <div className="px-5 py-3.5 text-[13px] text-gray-900">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Options */}
            {product.packagingOptions?.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Packaging Options</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {product.packagingOptions.map((opt) => (
                    <div key={opt} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-gray-700 font-medium">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Information */}
            {(product.incotermsSupported?.length > 0 || product.paymentTerms?.length > 0 || product.exportMarkets?.length > 0) && (
              <div>
                <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Export Information</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {product.incotermsSupported?.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                          <IconShip size={14} className="text-blue-600" />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Incoterms</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.incotermsSupported.map((t) => (
                          <span key={t} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[12px] font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.paymentTerms?.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                          <IconCard size={14} className="text-green-600" />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.paymentTerms.map((t) => (
                          <span key={t} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[12px] font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.exportMarkets?.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                          <IconGlobe size={14} className="text-orange-600" />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Markets</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.exportMarkets.map((m) => (
                          <span key={m} className="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[12px] font-semibold">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — Sticky info + CTA panel */}
          <div className="lg:sticky lg:top-6 space-y-5">

            {/* Short description — desktop only */}
            <p className="hidden lg:block text-gray-600 text-[16px] leading-relaxed">{product.shortDescription}</p>

            {/* Key stats grid */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                {stats.map((s) => (
                  <StatCell key={s.label} icon={s.icon} label={s.label} value={s.value} />
                ))}
              </div>
            )}

            {/* Available Grades */}
            {product.availableGrades?.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Available Grades</p>
                <div className="flex flex-wrap gap-2">
                  {product.availableGrades.map((g) => (
                    <span key={g} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[12px] font-semibold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {product.certifications?.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Certifications</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.certifications.map((c) => (
                    <span key={c} className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-[11px] font-bold">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* CTAs */}
            <div className="space-y-2.5">
              <a
                href={`/request-quote?product=${encodeURIComponent(product.name)}`}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-[15px] hover:bg-orange-600 active:scale-[0.99] transition shadow-lg shadow-orange-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Request a Quote
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-[15px] hover:bg-[#1ebe5d] active:scale-[0.99] transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Enquiry
              </a>
            </div>

            {/* Trust line */}
            <p className="text-center text-[12px] text-gray-400">
              We reply within <span className="font-semibold text-gray-600">24 business hours</span> · ISO 9001:2015 Certified
            </p>

            {/* Trust stats strip */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { value: "15+", label: "Years Export" },
                { value: "50+", label: "Countries" },
                { value: "98%", label: "On-time" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center py-3.5">
                  <p className="text-[15px] font-black text-orange-500">{value}</p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-gray-950 py-16 mt-4">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-orange-400 text-[11px] font-bold tracking-[0.2em] uppercase">Ready to source?</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-black text-white leading-tight">
            Get a quote for {product.name}
          </h2>
          <p className="mt-3 text-gray-400 text-[15px] max-w-xl mx-auto leading-relaxed">
            We'll send pricing, COA, phytosanitary certificates, and full shipping options within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a
              href={`/request-quote?product=${encodeURIComponent(product.name)}`}
              className="px-8 py-3.5 rounded-full bg-orange-500 text-white font-semibold text-[14px] hover:bg-orange-600 transition shadow-lg shadow-orange-900/30"
            >
              Request a Quote
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-[14px] hover:bg-[#1ebe5d] transition"
            >
              WhatsApp Enquiry
            </a>
            <a
              href="/products"
              className="px-8 py-3.5 rounded-full border border-gray-700 text-gray-400 font-semibold text-[14px] hover:border-gray-500 hover:text-gray-200 transition"
            >
              Browse All Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Inline icon components ─────────────────────────────────────────────── */

function IconPin() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconHash() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IconShip({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function IconCard({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function IconGlobe({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
