"use client";

import { useState, useMemo } from "react";
import type { IProduct } from "@/shared/interfaces/mongodb/products/product";

interface Props {
  initialProducts: IProduct[];
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80";

export default function ProductCatalog({ initialProducts }: Props) {
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(initialProducts.map((p) => p.category)))],
    [initialProducts]
  );

  const filtered = useMemo(
    () =>
      initialProducts.filter((p) => {
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        const matchSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }),
    [initialProducts, activeCategory, search]
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-orange-400 text-[12px] font-bold tracking-[0.2em] uppercase">Export Product Catalog</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Premium Indian Exports
          </h1>
          <p className="mt-4 text-gray-400 text-[16px] max-w-xl mx-auto">
            Certified, compliant, and export-ready products sourced from India's finest producers.
          </p>
          <div className="mt-8 relative max-w-md mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 text-[14px] focus:outline-none focus:border-orange-400 transition"
            />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-[16px]">No products found matching your search.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-[13px] mb-6">
                Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={String(product._id)} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-white mb-3">
            Don't see what you're looking for?
          </h2>
          <p className="text-gray-400 mb-6">
            We source 500+ Indian products. Send us your requirement and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/request-quote"
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-[14px] hover:bg-orange-600 transition"
            >
              Request a Custom Quote
            </a>
            <a
              href={`https://wa.me/917330810209?text=${encodeURIComponent("Hi Sindhur Exports, I'm looking for a product not listed on your catalog.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-[14px] hover:bg-[#1ebe5d] transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: IProduct }) {
  const img = product.images?.[0] || PLACEHOLDER;

  return (
    <a
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-white/95 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        {product.sampleAvailable && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            SAMPLE
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-[16px] group-hover:text-orange-500 transition-colors mb-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2 mb-4">
          {product.shortDescription}
        </p>

        {product.certifications?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.certifications.slice(0, 3).map((c) => (
              <span key={c} className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          {product.moq && (
            <span className="text-[12px] text-gray-400">MOQ: {product.moq}</span>
          )}
          <span className="ml-auto text-[13px] font-semibold text-orange-500 group-hover:text-orange-600 flex items-center gap-1">
            View Details
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
