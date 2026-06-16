import type { Metadata } from "next";
import type { ICertification } from "@/shared/interfaces/mongodb/certifications/certification";
import { mongoDB } from "@/shared/lib/db/mongo";
import CertificationModel from "@/shared/models/mongodb/certifications/certification";
import { cacheGet, cacheSet, CACHE_KEYS, TTL } from "@/utils/redis";

export const metadata: Metadata = {
  title: "Trust & Compliance — Sindhur Exports",
  description:
    "ISO 9001:2015, APEDA, FSSAI, FIEO and DGFT certified. Learn why 1000+ international buyers trust Sindhur Exports for compliant Indian exports.",
};

async function getCertifications(): Promise<ICertification[]> {
  const cached = await cacheGet<ICertification[]>(CACHE_KEYS.CERTS_ACTIVE);
  if (cached) return cached;

  try {
    await mongoDB();
    const items = await CertificationModel.find({ status: "active" }).lean();
    const result = items as unknown as ICertification[];
    await cacheSet(CACHE_KEYS.CERTS_ACTIVE, result, TTL.LIST);
    return result;
  } catch {
    return [];
  }
}

const STATIC_CERTS = [
  { name: "ISO 9001:2015", authority: "Bureau Veritas", desc: "International quality management standard covering every process from sourcing to shipment." },
  { name: "APEDA", authority: "Agri & Processed Food Products Export Development Authority", desc: "Government registration enabling export of agricultural and processed food products." },
  { name: "FSSAI", authority: "Food Safety and Standards Authority of India", desc: "National food safety certification ensuring products meet Indian and international food standards." },
  { name: "FIEO", authority: "Federation of Indian Export Organisations", desc: "Membership of India's apex body for exporters, providing global trade facilitation." },
  { name: "DGFT", authority: "Directorate General of Foreign Trade", desc: "Import Export Code (IEC) registered entity, authorised for all India export operations." },
];

const QUALITY_STEPS = [
  { icon: "🔬", title: "Pre-Shipment Sampling", text: "Lab-tested samples sent for buyer approval before production begins. COA provided for every batch." },
  { icon: "⚙️", title: "In-Process QC", text: "Quality control checkpoints at every stage of production, processing, and packaging." },
  { icon: "🏭", title: "Third-Party Inspection", text: "SGS, Bureau Veritas or buyer-nominated inspection agencies verify quality before container loading." },
  { icon: "📋", title: "Documentation Accuracy", text: "100% accurate export documentation — phytosanitary, fumigation, certificates of origin, COA." },
];

export default async function TrustPage() {
  const dbCerts = await getCertifications();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-orange-400 text-[12px] font-bold tracking-[0.2em] uppercase">Why Buyers Trust Us</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white leading-tight">
            Built on Compliance.<br />Backed by Certifications.
          </h1>
          <p className="mt-4 text-gray-400 text-[16px] max-w-2xl mx-auto">
            Every shipment from Sindhur Exports is backed by internationally recognised certifications, third-party quality inspections and zero-error documentation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {STATIC_CERTS.map((c) => (
              <span key={c.name} className="text-[12px] font-bold text-white bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DB Certifications (if any) */}
      {dbCerts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-gray-900">Our Certifications</h2>
              <p className="text-gray-500 mt-2">Verified credentials updated in real time</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbCerts.map((cert) => (
                <div key={String(cert._id)} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:border-orange-200 hover:shadow-md transition">
                  {cert.imageUrl && (
                    <img src={cert.imageUrl} alt={cert.name} className="h-16 object-contain mb-4" />
                  )}
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    cert.status === "active"
                      ? "bg-green-50 text-green-700"
                      : cert.status === "expired"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {cert.status.toUpperCase()}
                  </span>
                  <h3 className="font-black text-gray-900 text-[16px] mt-3 mb-1">{cert.name}</h3>
                  <p className="text-gray-500 text-[12px] mb-2">{cert.issuingAuthority}</p>
                  {cert.certificateNumber && (
                    <p className="text-gray-400 text-[11px]">Cert No: {cert.certificateNumber}</p>
                  )}
                  {cert.validTo && (
                    <p className="text-gray-400 text-[11px]">
                      Valid until: {new Date(cert.validTo).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </p>
                  )}
                  {cert.description && (
                    <p className="text-gray-600 text-[13px] mt-3 leading-relaxed">{cert.description}</p>
                  )}
                  {cert.documentUrl && (
                    <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-orange-500 text-[12px] font-semibold hover:text-orange-600 transition">
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Static certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900">Regulatory Credentials</h2>
            <p className="text-gray-500 mt-2">Every credential we hold and what it means for your imports</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STATIC_CERTS.map((cert) => (
              <div key={cert.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-orange-200 transition">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-black text-gray-900 text-[16px] mb-1">{cert.name}</h3>
                <p className="text-orange-500 text-[11px] font-semibold mb-3">{cert.authority}</p>
                <p className="text-gray-600 text-[13px] leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900">Quality Assurance Process</h2>
            <p className="text-gray-500 mt-2">Every shipment undergoes multi-stage quality verification</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUALITY_STEPS.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl mx-auto mb-4">
                  {s.icon}
                </div>
                <div className="text-orange-500 text-[11px] font-bold mb-2">STEP {i + 1}</div>
                <h3 className="font-black text-gray-900 text-[15px] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "Years of Export Experience" },
              { value: "50+", label: "Countries Served" },
              { value: "2000+", label: "Shipments Completed" },
              { value: "0", label: "Documentation Errors" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-black text-orange-500 mb-1">{value}</p>
                <p className="text-gray-400 text-[13px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Ready to Start Sourcing?</h2>
          <p className="text-gray-500 mb-6">
            Download our company profile or send your first RFQ. We'll share all certificates and compliance documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/request-quote" className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-[14px] hover:bg-orange-600 transition">
              Request a Quote
            </a>
            <a href="/downloads" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold text-[14px] hover:border-orange-300 hover:text-orange-500 transition">
              Download Company Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
