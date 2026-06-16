const CERTIFICATIONS = [
  { label: "APEDA Registered", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "ISO 9001:2015", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "FSSAI Licensed", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "FIEO Member", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "DGFT Recognized", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">About Us</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              India's Trusted Gateway to{" "}
              <span className="text-orange-500">Global Markets</span>
            </h2>
            <div className="mt-6 space-y-4 text-gray-600 text-[16px] leading-relaxed">
              <p>
                Founded in 2009, Sindhur Exports has grown from a regional commodities trader to one of India's most reliable multi-category export houses. Headquartered in Visakhapatnam, Andhra Pradesh, we specialize in agri commodities, spices, organic dehydrated powders and coconut products — serving buyers in over 50 countries across 6 continents.
              </p>
              <p>
                Our strength lies in a vertically integrated supply chain — from farm or factory to the final port of destination. We maintain strategic partnerships with over 200 verified Indian manufacturers, allowing us to offer competitive pricing without compromising quality.
              </p>
              <p>
                With a dedicated team of export professionals, compliance specialists, and logistics coordinators, we deliver seamless trade experiences for first-time importers and seasoned sourcing managers alike.
              </p>
            </div>

            {/* Certifications */}
            <div className="mt-10">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Certifications & Memberships</p>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((cert) => (
                  <span
                    key={cert.label}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${cert.color}`}
                  >
                    {cert.label}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 mt-8 text-[14px] font-semibold text-orange-500 hover:text-orange-600 transition-colors group"
            >
              Start a conversation
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Right: Image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80"
                  alt="Warehouse operations"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80"
                  alt="Container shipping"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80"
                  alt="Quality inspection"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&q=80"
                  alt="Spice market"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                🏆
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[15px]">Export Excellence Award</p>
                <p className="text-gray-500 text-[12px]">FIEO — 2023 & 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
