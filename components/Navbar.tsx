"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.08)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-base leading-none">SE</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-bold text-[15px] tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
              Sindhur Exports
            </span>
            <span className={`text-[10px] tracking-[0.15em] uppercase transition-colors ${scrolled ? "text-orange-500" : "text-orange-200"}`}>
              Est. 2009
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-wide transition-colors hover:text-orange-500 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            className={`text-[13px] font-medium tracking-wide transition-colors hover:text-orange-500 border rounded-full px-3 py-1 ${
              scrolled ? "text-gray-500 border-gray-200 hover:border-orange-300" : "text-white/60 border-white/20 hover:border-white/40"
            }`}
          >
            Admin
          </a>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className="text-[13px] font-semibold px-5 py-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Request Quote
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden flex flex-col gap-[5px] p-2 ${scrolled ? "text-gray-900" : "text-white"}`}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 transition-all duration-300 bg-current ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-0.5 w-5 transition-all duration-300 bg-current ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 transition-all duration-300 bg-current ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-gray-700 hover:text-orange-500 py-2.5 border-b border-gray-50 last:border-0 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 text-center text-[13px] font-semibold px-5 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Request Quote
          </a>
        </div>
      </div>
    </header>
  );
}
