import { TESTIMONIALS } from "@/lib/data";
import type { Testimonial } from "@/types";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 flex flex-col">
      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 text-[15px] leading-relaxed flex-1 mb-6">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-[14px]">{testimonial.name}</p>
          <p className="text-gray-500 text-[12px] truncate">{testimonial.role} · {testimonial.company}</p>
        </div>
        <span className="text-2xl">{testimonial.flag}</span>
      </div>
    </div>
  );
}

const LOGOS = [
  "EuroTrade GmbH", "Sakura Trade Co.", "AfriSource Ltd.",
  "Pacific Imports", "Gulf Traders LLC", "Maple Foods Inc.",
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">Client Trust</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
            What Our Global Clients Say
          </h2>
          <p className="mt-5 text-gray-500 text-[16px] leading-relaxed">
            Trusted by procurement teams, import directors, and trading companies across the world.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-20 text-center">
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-8">
            Trusted by companies across the globe
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {LOGOS.map((logo) => (
              <div
                key={logo}
                className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-semibold text-[13px] hover:border-orange-200 hover:text-orange-500 transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
