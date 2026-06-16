"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { BusinessType } from "@/shared/interfaces/mongodb/rfq/rfq";

const BUSINESS_TYPES: BusinessType[] = [
  "Importer", "Distributor", "Retailer", "Wholesaler", "Manufacturer", "Other",
];

const INCOTERMS = ["EXW", "FOB", "CIF", "CFR", "DAP", "DDP", "CPT", "CIP", "FCA"];

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition";

const labelCls = "block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function RFQForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [form, setForm] = useState({
    buyerName:            "",
    companyName:          "",
    email:                "",
    phone:                "",
    country:              "",
    businessType:         "" as BusinessType | "",
    productInterested:    "",
    quantityRequired:     "",
    targetPrice:          "",
    destinationPort:      "",
    preferredIncoterm:    "",
    packagingRequirements:"",
    customRequirements:   "",
    message:              "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);

  useEffect(() => {
    const p = searchParams.get("product");
    if (p) setForm((f) => ({ ...f, productInterested: p }));
  }, [searchParams]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessType) { toast.error("Please select your business type"); return; }
    setSubmitting(true);
    try {
      const res  = await fetch("/api/v1/rfq", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-gray-100 p-10 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">RFQ Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Thank you, <strong>{form.buyerName}</strong>. Our team will review your requirements and respond within 24 hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => { setDone(false); setForm(f => ({ ...f, productInterested: "", quantityRequired: "", targetPrice: "", message: "" })); }}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Submit Another RFQ
            </button>
            <a href="/products" className="block w-full py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition text-center">
              Browse Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-orange-400 text-[12px] font-bold tracking-[0.2em] uppercase">Get a Quote</span>
          <h1 className="mt-3 text-4xl font-black text-white">Request for Quotation</h1>
          <p className="mt-3 text-gray-400 max-w-xl">
            Tell us your sourcing requirements. We respond with pricing, specifications and compliance documents within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-2 space-y-8">
            {/* Section 1 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h2 className="font-black text-gray-900 text-[18px] mb-6">About You</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required className={inputCls} placeholder="John Smith" value={form.buyerName} onChange={(e) => set("buyerName", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Company Name *</label>
                  <input required className={inputCls} placeholder="Acme Imports Ltd." value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input required type="email" className={inputCls} placeholder="john@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input className={inputCls} placeholder="+1 555 000 0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Country *</label>
                  <input required className={inputCls} placeholder="United States" value={form.country} onChange={(e) => set("country", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Business Type *</label>
                  <select required className={inputCls} value={form.businessType} onChange={(e) => set("businessType", e.target.value)}>
                    <option value="">Select type...</option>
                    {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h2 className="font-black text-gray-900 text-[18px] mb-6">Product Requirements</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Product Interested In *</label>
                  <input required className={inputCls} placeholder="e.g., Fresh Coconuts, Basmati Rice, Turmeric Powder" value={form.productInterested} onChange={(e) => set("productInterested", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Quantity Required</label>
                  <input className={inputCls} placeholder="e.g., 5 MT, 1 FCL, 10,000 units" value={form.quantityRequired} onChange={(e) => set("quantityRequired", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Target Price (USD)</label>
                  <input className={inputCls} placeholder="e.g., $1,200/MT FOB" value={form.targetPrice} onChange={(e) => set("targetPrice", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Preferred Incoterm</label>
                  <select className={inputCls} value={form.preferredIncoterm} onChange={(e) => set("preferredIncoterm", e.target.value)}>
                    <option value="">Select incoterm...</option>
                    {INCOTERMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Destination Port</label>
                  <input className={inputCls} placeholder="e.g., Port of Rotterdam" value={form.destinationPort} onChange={(e) => set("destinationPort", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h2 className="font-black text-gray-900 text-[18px] mb-6">Additional Details</h2>
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Packaging Requirements</label>
                  <input className={inputCls} placeholder="e.g., 25kg PP bags, private label, custom branding" value={form.packagingRequirements} onChange={(e) => set("packagingRequirements", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Custom Requirements</label>
                  <textarea rows={2} className={inputCls} placeholder="Certifications needed, quality specs, grading..." value={form.customRequirements} onChange={(e) => set("customRequirements", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Message</label>
                  <textarea rows={3} className={inputCls} placeholder="Any additional information about your requirement..." value={form.message} onChange={(e) => set("message", e.target.value)} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-[16px] hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit RFQ — Get a Quote"}
            </button>
          </form>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Review", text: "Our team reviews your RFQ within 2 hours during business hours." },
                  { step: "2", title: "Quotation", text: "We send you detailed pricing, specs, COA and compliance documents." },
                  { step: "3", title: "Sample", text: "We ship product samples for your approval before bulk order." },
                ].map(({ step, title, text }) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[12px] font-black flex items-center justify-center flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-[13px]">{title}</p>
                      <p className="text-gray-500 text-[12px] mt-0.5">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950 rounded-2xl p-6">
              <p className="text-gray-400 text-[12px] uppercase font-bold tracking-widest mb-3">Direct Contact</p>
              <a
                href={`https://wa.me/917330810209?text=${encodeURIComponent("Hi Sindhur Exports, I'd like to discuss a sourcing requirement.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-[#25D366] rounded-xl text-white font-semibold text-[14px] hover:bg-[#1ebe5d] transition mb-3"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp: +91 73308 10209
              </a>
              <a href="mailto:varma.v.business@gmail.com" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl text-white font-medium text-[13px] hover:bg-white/20 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                varma.v.business@gmail.com
              </a>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <p className="text-[12px] text-orange-600 font-bold uppercase tracking-wider mb-2">Response Guarantee</p>
              <p className="text-gray-700 text-[13px] leading-relaxed">
                We respond to all RFQs within <strong>24 hours</strong> on business days (Mon–Fri 9AM–6:30PM IST).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <Suspense>
      <RFQForm />
    </Suspense>
  );
}
