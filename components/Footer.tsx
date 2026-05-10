const FOOTER_LINKS = {
  "Quick Links": [
    { label: "About Us", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Global Presence", href: "#global" },
    { label: "Our Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  "Products": [
    { label: "Basmati Rice", href: "#products" },
    { label: "Spices & Masalas", href: "#products" },
    { label: "Textiles & Fabrics", href: "#products" },
    { label: "Handicrafts", href: "#products" },
    { label: "Organic Pulses", href: "#products" },
  ],
  "Resources": [
    { label: "Product Catalogue", href: "#" },
    { label: "Export Documentation", href: "#" },
    { label: "Shipping & Logistics", href: "#" },
    { label: "Quality Standards", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Twitter/X",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

const CERTIFICATIONS = [
  "ISO 9001:2015", "APEDA", "FSSAI", "FIEO", "DGFT",
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top row */}
        <div className="grid lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-black text-base">SE</span>
              </div>
              <div>
                <span className="font-bold text-white text-[15px] block leading-none">Sindhur Exports</span>
                <span className="text-orange-400 text-[10px] tracking-[0.15em] uppercase">Est. 2009</span>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-500 mb-6 max-w-xs">
              India's trusted multi-category export company. Delivering quality products to global buyers with reliability, compliance, and care.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-orange-500 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-[13px] uppercase tracking-widest mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-gray-500 hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-600">
            © {new Date().getFullYear()} Sindhur Exports. All rights reserved. Hyderabad, India.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-gray-600 mr-1">Certified:</span>
            {CERTIFICATIONS.map((cert) => (
              <span key={cert} className="text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
