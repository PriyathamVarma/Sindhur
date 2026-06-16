"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface FormState {
  name: string;
  company: string;
  email: string;
  country: string;
  product: string;
  message: string;
}

const initialFormState: FormState = {
  name: "", company: "", email: "", country: "", product: "", message: "",
};

const CONTACT_INFO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "varma.v.business@gmail.com",
    href: "mailto:varma.v.business@gmail.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone / WhatsApp",
    value: "+91 73308 10209",
    href: "tel:+917330810209",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Office Address",
    value: "Visakhapatnam, Andhra Pradesh – 530001, India",
    href: "https://maps.google.com/?q=Visakhapatnam,Andhra+Pradesh,India",
  },
];

export default function ContactSection() {
  const [form, setForm]           = useState<FormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/v1/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("Inquiry received! We'll respond within 24 hours.");
      } else {
        toast.error(data.message || "Failed to send. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 text-[12px] font-bold tracking-[0.2em] uppercase">Contact Us</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
            Start Your Export Journey
          </h2>
          <p className="mt-5 text-gray-500 text-[16px] leading-relaxed">
            Reach out for product inquiries, pricing, samples, or general questions. We respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-6">
            {CONTACT_INFO.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "Office Address" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-gray-700 text-[14px] font-medium leading-relaxed">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Business Hours */}
            <div className="p-5 bg-orange-500 rounded-2xl text-white">
              <p className="font-bold text-[15px] mb-3">Business Hours (IST)</p>
              <div className="space-y-1.5 text-[13px] text-orange-100">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-semibold text-white">9:00 AM – 6:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-white">9:00 AM – 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-white">Closed</span>
                </div>
              </div>
              <p className="mt-3 text-orange-200 text-[12px]">WhatsApp available 24/7 for urgent inquiries</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mb-5">
                  ✅
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Received!</h3>
                <p className="text-gray-500 text-[15px] max-w-sm">
                  Thank you for reaching out. Our export team will respond to your inquiry within 24 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialFormState); }}
                  className="mt-8 text-[14px] font-semibold text-orange-500 hover:text-orange-600 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-[16px] font-bold text-gray-900 mb-6">Request a Quote or Product Information</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Company</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Your Company Ltd."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="United States"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Product / Category of Interest</label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-[14px] text-gray-800 bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a product category</option>
                    <option>Fresh Coconuts</option>
                    <option>Coconut By-Products</option>
                    <option>Basmati & Non-Basmati Rice</option>
                    <option>Organic Dehydrated Powders</option>
                    <option>Spices & Masalas</option>
                    <option>Herbal & Botanical Extracts</option>
                    <option>Other / Multiple Categories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Message / Requirements</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Please describe your requirements — quantity, target market, certifications needed, packaging preferences, etc."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-[14px] text-gray-800 placeholder-gray-400 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.email}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl text-[15px] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-[12px] text-gray-400">
                  No spam. We'll only contact you regarding your inquiry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
