"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { value: "50+", label: "Countries Served" },
  { value: "15+", label: "Years Experience" },
  { value: "2000+", label: "Shipments Annually" },
  { value: "98%", label: "On-Time Delivery" },
];

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-gray-950">
      {/* Background image with parallax */}
      <div ref={parallaxRef} className="absolute inset-0 scale-110">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=80"
          alt="Global shipping"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/30 to-gray-950/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />

      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 pt-24 md:pb-20 md:pt-36 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-300 text-[12px] font-semibold tracking-[0.12em] uppercase">
              Trusted Global Export Partner Since 2009
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            India's Premium{" "}
            <span className="relative inline-block">
              <span className="text-orange-400">Export</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C40 2 80 2 100 4C120 6 160 6 198 2" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            Company
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-light">
            Delivering quality Indian products to over 50 countries worldwide. From agri commodities and spices to textiles and handicrafts — we connect Indian excellence with global markets.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-full text-[15px] transition-all duration-200 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Request a Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-[15px] border border-white/20 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
            >
              Explore Products
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-10 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm px-6 py-5 text-center transition-colors duration-200"
            >
              <div className="text-3xl md:text-4xl font-black text-orange-400 tabular-nums">{value}</div>
              <div className="text-gray-400 text-[12px] font-medium tracking-wide uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
