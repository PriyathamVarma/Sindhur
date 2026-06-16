"use client";

import { useEffect, useState } from "react";
import { Download, Plus, PenLine, Trash2, X, Eye, EyeOff } from "lucide-react";
import type { IDownload, DownloadType, DownloadStatus } from "@/shared/interfaces/mongodb/downloads/download";
import toast from "react-hot-toast";

const TYPES: DownloadType[] = ["Company Profile", "Product Catalog", "Certification", "Brochure", "Other"];
const TYPE_BADGE: Record<string, string> = {
  "Company Profile": "bg-blue-50 text-blue-700",
  "Product Catalog": "bg-orange-50 text-orange-700",
  "Certification":   "bg-green-50 text-green-700",
  "Brochure":        "bg-purple-50 text-purple-700",
  "Other":           "bg-gray-100 text-gray-600",
};

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition";
const labelCls = "block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

interface DownloadRow extends IDownload { _id: string }

const EMPTY = { title: "", description: "", fileUrl: "", type: "Company Profile" as DownloadType, requiresLeadCapture: false, status: "published" as DownloadStatus };

export default function AdminDownloadsPage() {
  const [items, setItems]    = useState<DownloadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel]    = useState<"none" | "new" | string>("none");
  const [form, setForm]      = useState({ ...EMPTY });
  const [saving, setSaving]  = useState(false);

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/v1/downloads?admin=true", { credentials: "include" });
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function openNew()  { setForm({ ...EMPTY }); setPanel("new"); }
  function openEdit(item: DownloadRow) {
    setForm({
      title: item.title, description: item.description, fileUrl: item.fileUrl,
      type: item.type, requiresLeadCapture: item.requiresLeadCapture, status: item.status,
    });
    setPanel(item._id);
  }

  async function submit() {
    if (!form.title || !form.description || !form.fileUrl || !form.type) { toast.error("All required fields must be filled"); return; }
    setSaving(true);
    try {
      const isEdit = panel !== "new";
      const res    = await fetch(isEdit ? `/api/v1/downloads/${panel}` : "/api/v1/downloads", {
        method:  isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { toast.success(isEdit ? "Updated" : "Created"); setPanel("none"); load(); }
      else toast.error(data.message);
    } catch { toast.error("Network error"); }
    finally  { setSaving(false); }
  }

  async function toggleStatus(item: DownloadRow) {
    const next = item.status === "published" ? "draft" : "published";
    const res  = await fetch(`/api/v1/downloads/${item._id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (data.success) { toast.success(next === "published" ? "Published" : "Unpublished"); load(); }
    else toast.error(data.message);
  }

  async function deleteItem(item: DownloadRow) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res  = await fetch(`/api/v1/downloads/${item._id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); setItems((x) => x.filter((y) => y._id !== item._id)); }
    else toast.error(data.message);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Downloads</h1>
          <p className="text-gray-500 text-sm mt-1">Manage company profile, catalogs and brochures</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-[13px] font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
          <Plus className="w-4 h-4" /> Add Download
        </button>
      </div>

      {/* Side panel */}
      {panel !== "none" && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPanel("none")} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-gray-900 text-[18px]">{panel === "new" ? "Add Download" : "Edit Download"}</h2>
              <button onClick={() => setPanel("none")} className="text-gray-400 hover:text-gray-900 transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Title *</label><input required className={inputCls} placeholder="Company Profile 2024" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
              <div><label className={labelCls}>Description *</label><textarea rows={2} className={inputCls} placeholder="Brief description..." value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
              <div><label className={labelCls}>File URL *</label><input required className={inputCls} placeholder="https://..." value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} /></div>
              <div><label className={labelCls}>Type *</label>
                <select required className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="published">Published</option><option value="draft">Draft</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input type="checkbox" checked={form.requiresLeadCapture} onChange={(e) => set("requiresLeadCapture", e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900 text-[13px]">Require Lead Capture</p>
                  <p className="text-gray-400 text-[11px]">Collect name + email before download</p>
                </div>
              </label>
              <button onClick={submit} disabled={saving} className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-[14px] hover:bg-orange-600 transition disabled:opacity-60">
                {saving ? "Saving..." : panel === "new" ? "Add Download" : "Save Changes"}
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
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <Download className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-[14px]">No download items yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_BADGE[item.type] || TYPE_BADGE["Other"]}`}>{item.type}</span>
                    {item.requiresLeadCapture && <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Lead Capture</span>}
                  </div>
                  <p className="font-bold text-gray-900 text-[14px] truncate">{item.title}</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border hidden sm:block ${item.status === "published" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>{item.status}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleStatus(item)} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition" title={item.status === "published" ? "Unpublish" : "Publish"}>
                    {item.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition" title="Edit"><PenLine className="w-4 h-4" /></button>
                  <button onClick={() => deleteItem(item)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
