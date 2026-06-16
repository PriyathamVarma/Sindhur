import { WHY_CHOOSE } from "@/lib/data";

export default function WhyChooseSection() {
  return (
    <section className="py-16 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left sticky */}
          <div className="lg:sticky lg:top-28">
            <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">Why Sindhur</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Why Global Buyers{" "}
              <span className="text-orange-500">Trust Us</span>
            </h2>
            <p className="mt-5 text-gray-500 text-[16px] leading-relaxed">
              We've built our reputation on three pillars: uncompromising quality, reliable logistics, and transparent communication. Here's what sets us apart.
            </p>

            <div className="mt-10 p-8 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-gray-900 font-semibold text-[15px] mb-4">Our Quality Promise</p>
              <ul className="space-y-3 text-[14px] text-gray-600">
                {[
                  "Pre-shipment quality inspection for every order",
                  "Third-party lab testing available on request",
                  "100% documentation accuracy guarantee",
                  "Replacement guarantee for quality deviations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Feature grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY_CHOOSE.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-200 bg-white hover:bg-orange-50/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-50"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-2xl mb-4 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-[15px] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
