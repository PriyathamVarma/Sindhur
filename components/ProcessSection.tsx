import { PROCESS_STEPS } from "@/lib/data";

export default function ProcessSection() {
  return (
    <section id="process" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">How It Works</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
            Your Export Journey,{" "}
            <span className="text-orange-500">Simplified</span>
          </h2>
          <p className="mt-5 text-gray-500 text-[16px] leading-relaxed">
            From first inquiry to final delivery — a transparent, predictable, and professionally managed export process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 z-0 mx-20" />

          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-lg shadow-gray-200 border border-gray-100 group-hover:border-orange-200 group-hover:shadow-orange-100 flex flex-col items-center justify-center transition-all duration-300">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-[10px] font-black text-orange-400 tracking-widest uppercase mt-1">
                      Step {step.step}
                    </span>
                  </div>
                  {/* Mobile connector */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="lg:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 h-8 w-px bg-orange-200" />
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-[15px] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="350" cy="50" r="100" fill="white"/>
              <circle cx="50" cy="160" r="80" fill="white"/>
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-3xl font-black text-white mb-3">Ready to Start Your First Export Order?</h3>
            <p className="text-orange-100 text-[16px] mb-8 max-w-lg mx-auto">
              Reach out today and our export consultants will guide you through every step of the process — at no consultation fee.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-orange-600 font-bold rounded-full text-[15px] hover:bg-orange-50 transition-all duration-200 shadow-xl shadow-orange-700/20"
            >
              Get Started Today
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
