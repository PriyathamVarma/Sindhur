import { PRODUCTS } from "@/lib/data";
import type { Product } from "@/types";

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:shadow-orange-50 transition-all duration-300">
      <div className="relative overflow-hidden h-52">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
        <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white bg-orange-500/90 backdrop-blur-sm rounded-full px-3 py-1">
          {product.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-[17px] font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{product.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-orange-500 hover:text-orange-600 transition-colors group/link"
        >
          Enquire Now
          <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  return (
    <section id="products" className="py-16 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">Our Products</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
            What We Export
          </h2>
          <p className="mt-5 text-gray-500 text-[16px] leading-relaxed">
            Across 6 major categories, we source and export premium Indian products that meet stringent international quality and compliance standards.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-14 text-center">
          <p className="text-gray-500 text-[15px] mb-4">
            Don't see your product category? We export much more.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-orange-500 text-orange-500 font-semibold text-[14px] hover:bg-orange-500 hover:text-white transition-all duration-200"
          >
            Discuss Your Requirements
          </a>
        </div>
      </div>
    </section>
  );
}
