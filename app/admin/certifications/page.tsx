"use client";

import { useEffect, useState } from "react";
import { Award, Plus, PenLine, Trash2, X } from "lucide-react";
import type { ICertification, CertificationStatus } from "@/shared/interfaces/mongodb/certifications/certification";
import { formatDate } from "@/shared/lib/utils";
import toast from "react-hot-toast";

const STATUS_BADGE: Record<string, string> = {
  active:  "bg-green-50 text-green-700 border-green-200",
  expired: "bg-red-50 text-red-600 border-red-200",
  hidden:  "bg-gray-100 text-gray-500 border-gray-200",
};

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition";
const labelCls = "block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

interface CertRow extends ICertification { _id: string }

const EMPTY_FORM = {
  name: "", issuingAuthority: "", certificateNumber: "",
  validFrom: "", validTo: "", imageUrl: "", documentUrl: "",
  description: "", status: "active" as CertificationStatus,
};

export default function AdminCertificationsPage() {
  const [certs, setCerts]    = useState<CertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel]    = useState<"none" | "new" | string>("none");
  const [form, setForm]      = useState({ ...EMPTY_FORM });
  const [saving, setSaving]  = useState(false);

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/v1/certifications?admin=true", { credentials: "include" });
    const data = await res.json();
    if (data.success) setCerts(data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function openNew()  { setForm({ ...EMPTY_FORM }); setPanel("new"); }
  function openEdit(c: CertRow) {
    setForm({
      name: c.name, issuingAuthority: c.issuingAuthority,
      certificateNumber: c.certificateNumber || "",
      validFrom: c.validFrom ? new Date(c.validFrom).toISOString().split("T")[0] : "",
      validTo:   c.validTo   ? new Date(c.validTo).toISOString().split("T")[0]   : "",
      imageUrl: c.imageUrl || "", documentUrl: c.documentUrl || "",
      description: c.description || "", status: c.status,
    });
    setPanel(c._id);
  }

  async function submit() {
    if (!form.name || !form.issuingAuthority) { toast.error("Name and issuing authority required"); return; }
    setSaving(true);
    try {
      const body = { ...form, validFrom: form.validFrom || undefined, validTo: form.validTo || undefined };
      const isEdit = panel !== "new";
      const res = await fetch(isEdit ? `/api/v1/certifications/${panel}` : "/api/v1/certifications", {
        method:  isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { toast.success(isEdit ? "Updated" : "Created"); setPanel("none"); load(); }
      else toast.error(data.message);
    } catch { toast.error("Network error"); }
    finally  { setSaving(false); }
  }

  async function deleteCert(c: CertRow) {
    if (!confirm(`Delete "${c.name}"?`)) return;
    const res  = await fetch(`/api/v1/certifications/${c._id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); setCerts((x) => x.filter((y) => y._id !== c._id)); }
    else toast.error(data.message);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Certifications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage company certificates and credentials</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-[13px] font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {/* Side panel */}
      {panel !== "none" && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPanel("none")} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-gray-900 text-[18px]">{panel === "new" ? "Add Certification" : "Edit Certification"}</h2>
              <button onClick={() => setPanel("none")} className="text-gray-400 hover:text-gray-900 transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Name *</label><input required className={inputCls} placeholder="ISO 9001:2015" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div><label className={labelCls}>Issuing Authority *</label><input required className={inputCls} placeholder="Bureau Veritas" value={form.issuingAuthority} onChange={(e) => set("issuingAuthority", e.target.value)} /></div>
              <div><label className={labelCls}>Certificate Number</label><input className={inputCls} placeholder="BV-2024-12345" value={form.certificateNumber} onChange={(e) => set("certificateNumber", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Valid From</label><input type="date" className={inputCls} value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} /></div>
                <div><label className={labelCls}>Valid To</label><input type="date" className={inputCls} value={form.validTo} onChange={(e) => set("validTo", e.target.value)} /></div>
              </div>
              <div><label className={labelCls}>Image URL</label><input className={inputCls} placeholder="https://..." value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></div>
              <div><label className={labelCls}>Document URL</label><input className={inputCls} placeholder="https://..." value={form.documentUrl} onChange={(e) => set("documentUrl", e.target.value)} /></div>
              <div><label className={labelCls}>Description</label><textarea rows={3} className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
              <div><label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <button onClick={submit} disabled={saving} className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-[14px] hover:bg-orange-600 transition disabled:opacity-60">
                {saving ? "Saving..." : panel === "new" ? "Add Certification" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">{Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-4 animate-pulse flex gap-4"><div className="flex-1 h-4 bg-gray-100 rounded" /></div>
          ))}</div>
        ) : certs.length === 0 ? (
          <div className="py-16 text-center">
            <Award className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-[14px]">No certifications added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {certs.map((cert) => (
              <div key={cert._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {cert.imageUrl && <img src={cert.imageUrl} alt={cert.name} className="w-10 h-10 object-contain flex-shrink-0" />}
                {!cert.imageUrl && <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0"><Award className="w-5 h-5 text-orange-500" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-[14px] truncate">{cert.name}</p>
                  <p className="text-gray-400 text-[12px]">{cert.issuingAuthority}</p>
                </div>
                {cert.validTo && (
                  <p className="text-[12px] text-gray-400 hidden sm:block">
                    Exp: {new Date(cert.validTo).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                )}
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border hidden md:block ${STATUS_BADGE[cert.status]}`}>
                  {cert.status}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(cert)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition" title="Edit"><PenLine className="w-4 h-4" /></button>
                  <button onClick={() => deleteCert(cert)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
