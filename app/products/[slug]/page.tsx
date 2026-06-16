import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import type { IProduct } from "@/shared/interfaces/mongodb/products/product";

async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res  = await fetch(`${base}/api/v1/products/${slug}`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
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

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const waMsg = encodeURIComponent(
    `Hi Sindhur Exports, I'm interested in importing ${product.name} from India. Please send me a quote.`
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-[12px] text-gray-500">
          <a href="/" className="hover:text-orange-500 transition">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-orange-500 transition">Products</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <ProductGallery images={product.images} name={product.name} />

            {/* Info Panel */}
            <div className="space-y-5">
              <div>
                <span className="text-[12px] font-bold text-orange-500 uppercase tracking-wider">{product.category}</span>
                <h1 className="mt-2 text-3xl lg:text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
                {product.scientificName && (
                  <p className="mt-1 text-gray-400 text-[13px] italic">{product.scientificName}</p>
                )}
              </div>

              <p className="text-gray-600 text-[16px] leading-relaxed">{product.shortDescription}</p>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-3">
                {product.hsCode && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">HS Code</p>
                    <p className="font-bold text-gray-900 text-[14px]">{product.hsCode}</p>
                  </div>
                )}
                {product.origin && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Origin</p>
                    <p className="font-bold text-gray-900 text-[14px]">{product.origin}</p>
                  </div>
                )}
                {product.leadTime && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Lead Time</p>
                    <p className="font-bold text-gray-900 text-[14px]">{product.leadTime}</p>
                  </div>
                )}
                {product.shelfLife && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Shelf Life</p>
                    <p className="font-bold text-gray-900 text-[14px]">{product.shelfLife}</p>
                  </div>
                )}
                {product.moq && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Min Order (MOQ)</p>
                    <p className="font-bold text-gray-900 text-[14px]">{product.moq}</p>
                  </div>
                )}
                {product.containerCapacity && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Container Capacity</p>
                    <p className="font-bold text-gray-900 text-[14px]">{product.containerCapacity}</p>
                  </div>
                )}
              </div>

              {/* Grades */}
              {product.availableGrades?.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Grades</p>
                  <div className="flex flex-wrap gap-2">
                    {product.availableGrades.map((g) => (
                      <span key={g} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[12px] font-semibold">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability badges */}
              <div className="flex gap-2 flex-wrap">
                {product.sampleAvailable && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[12px] font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Sample Available
                  </span>
                )}
                {product.privateLabelAvailable && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[12px] font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Private Label Available
                  </span>
                )}
              </div>

              {/* Certifications */}
              {product.certifications?.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.certifications.map((c) => (
                      <span key={c} className="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-[11px] font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`/request-quote?product=${encodeURIComponent(product.name)}`}
                  className="w-full text-center py-4 rounded-xl bg-orange-500 text-white font-bold text-[15px] hover:bg-orange-600 transition shadow-lg shadow-orange-200"
                >
                  Request Quote for {product.name}
                </a>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-[15px] hover:bg-[#1ebe5d] transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Description */}
      {product.fullDescription && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl font-black text-gray-900 mb-5">Product Overview</h2>
            <div
              className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.fullDescription }}
            />
          </div>
        </section>
      )}

      {/* Specs + Packaging */}
      {(product.specifications?.length > 0 || product.packagingOptions?.length > 0) && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-5">Technical Specifications</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <div className="w-44 flex-shrink-0 px-5 py-3.5 text-[13px] font-semibold text-gray-600 border-r border-gray-100">
                        {spec.label}
                      </div>
                      <div className="flex-1 px-5 py-3.5 text-[13px] text-gray-900">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging */}
            {product.packagingOptions?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-5">Packaging Options</h2>
                <div className="space-y-2.5">
                  {product.packagingOptions.map((opt) => (
                    <div key={opt} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[14px] text-gray-700">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Export Information */}
      {(product.incotermsSupported?.length > 0 || product.paymentTerms?.length > 0 || product.exportMarkets?.length > 0) && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-xl font-black text-gray-900 mb-8">Export Information</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {product.incotermsSupported?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Supported Incoterms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.incotermsSupported.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[12px] font-bold">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.paymentTerms?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Terms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.paymentTerms.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[12px] font-bold">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.exportMarkets?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Export Markets</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.exportMarkets.map((m) => (
                      <span key={m} className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-[12px] font-semibold">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-white mb-3">
            Ready to source {product.name}?
          </h2>
          <p className="text-gray-400 mb-6">
            Request a detailed quotation including pricing, COA, compliance documents and shipping options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`/request-quote?product=${encodeURIComponent(product.name)}`}
              className="px-8 py-3.5 rounded-full bg-orange-500 text-white font-semibold text-[14px] hover:bg-orange-600 transition"
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
          </div>
        </div>
      </section>
    </div>
  );
}
