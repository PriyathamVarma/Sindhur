"use client";

import { useState, useEffect } from "react";
import type { IDownload } from "@/shared/interfaces/mongodb/downloads/download";
import toast from "react-hot-toast";

const TYPE_COLORS: Record<string, string> = {
  "Company Profile": "bg-blue-50 text-blue-700",
  "Product Catalog": "bg-orange-50 text-orange-700",
  "Certification":   "bg-green-50 text-green-700",
  "Brochure":        "bg-purple-50 text-purple-700",
  "Other":           "bg-gray-100 text-gray-600",
};

const TYPE_ICONS: Record<string, string> = {
  "Company Profile": "🏢",
  "Product Catalog": "📦",
  "Certification":   "🏅",
  "Brochure":        "📄",
  "Other":           "📎",
};

interface LeadForm {
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition";

export default function DownloadsPage() {
  const [items, setItems]       = useState<IDownload[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<IDownload | null>(null);
  const [lead, setLead]         = useState<LeadForm>({ name: "", email: "", company: "", country: "", phone: "" });
  const [submitting, setSubmit] = useState(false);

  useEffect(() => {
    fetch("/api/v1/downloads")
      .then((r) => r.json())
      .then((d) => { if (d.success) setItems(d.data); })
      .finally(() => setLoading(false));
  }, []);

  function handleDownload(item: IDownload) {
    if (item.requiresLeadCapture) {
      setModal(item);
    } else {
      window.open(item.fileUrl, "_blank");
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setSubmit(true);
    try {
      const res  = await fetch("/api/v1/download-leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...lead, downloadId: modal._id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Downloading...");
        window.open(data.data.fileUrl, "_blank");
        setModal(null);
        setLead({ name: "", email: "", company: "", country: "", phone: "" });
      } else {
        toast.error(data.message || "Failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmit(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-orange-400 text-[12px] font-bold tracking-[0.2em] uppercase">Resources</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white">Downloads & Catalog</h1>
          <p className="mt-4 text-gray-400 text-[16px] max-w-xl mx-auto">
            Company profiles, product catalogs, certifications and brochures — all in one place.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
                  <div className="h-5 bg-gray-100 rounded w-40 mb-2" />
                  <div className="h-16 bg-gray-100 rounded mb-4" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">📂</p>
              <p className="text-gray-400 text-[16px]">No downloads available yet.</p>
              <a href="/request-quote" className="mt-6 inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition">
                Request Documents
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={String(item._id)} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-orange-200 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${TYPE_COLORS[item.type] || TYPE_COLORS["Other"]}`}>
                      {item.type}
                    </span>
                    <span className="text-3xl">{TYPE_ICONS[item.type] || "📎"}</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-[16px] mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed mb-5">{item.description}</p>
                  {item.requiresLeadCapture && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-3">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Quick form required
                    </p>
                  )}
                  <button
                    onClick={() => handleDownload(item)}
                    className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold text-[14px] hover:bg-orange-600 transition"
                  >
                    {item.requiresLeadCapture ? "Download — Quick Form" : "Download Free"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lead capture modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-6">
              <p className="text-[12px] font-bold text-orange-500 uppercase tracking-wider mb-1">Downloading</p>
              <h3 className="text-xl font-black text-gray-900">{modal.title}</h3>
              <p className="text-gray-500 text-[13px] mt-1">Please fill in your details to access this document.</p>
            </div>
            <form onSubmit={submitLead} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input required className={inputCls} placeholder="John Smith" value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                <input required type="email" className={inputCls} placeholder="john@company.com" value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Company</label>
                  <input className={inputCls} placeholder="Company" value={lead.company} onChange={(e) => setLead((l) => ({ ...l, company: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
                  <input className={inputCls} placeholder="Country" value={lead.country} onChange={(e) => setLead((l) => ({ ...l, country: e.target.value }))} />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-[14px] hover:bg-orange-600 transition disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Download Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
