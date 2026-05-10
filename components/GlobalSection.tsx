import { COUNTRIES } from "@/lib/data";

const REGIONS = ["Americas", "Europe", "Middle East", "Asia Pacific", "Africa"];

export default function GlobalSection() {
  return (
    <section id="global" className="py-28 bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-400 text-[12px] font-bold tracking-[0.2em] uppercase">Global Reach</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            We Export to{" "}
            <span className="text-orange-400">50+ Countries</span>
          </h2>
          <p className="mt-5 text-gray-400 text-[16px] leading-relaxed">
            Our established trade network spans six continents, with local compliance expertise ensuring seamless import clearances in every market.
          </p>
        </div>

        {/* Regions with countries */}
        <div className="space-y-8">
          {REGIONS.map((region) => {
            const regionCountries = COUNTRIES.filter((c) => c.region === region);
            if (regionCountries.length === 0) return null;
            return (
              <div key={region} className="flex flex-col sm:flex-row gap-4 sm:items-start">
                <div className="sm:w-32 flex-shrink-0">
                  <span className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase">{region}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {regionCountries.map((country) => (
                    <div
                      key={country.name}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 rounded-full px-4 py-2 transition-all duration-200 cursor-default"
                    >
                      <span className="text-lg leading-none">{country.flag}</span>
                      <span className="text-gray-300 text-[13px] font-medium">{country.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "50+", label: "Countries", desc: "Active trade relationships" },
            { value: "6", label: "Continents", desc: "Global footprint" },
            { value: "200+", label: "Ports Served", desc: "Worldwide entry points" },
            { value: "$40M+", label: "Annual Trade", desc: "Cumulative export value" },
          ].map(({ value, label, desc }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-orange-400">{value}</div>
              <div className="text-white font-bold mt-1 text-[15px]">{label}</div>
              <div className="text-gray-500 text-[12px] mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
