"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import toast from "react-hot-toast";
import type { IProduct, ProductStatus } from "@/shared/interfaces/mongodb/products/product";

const CATEGORIES = ["Agri Commodities", "Organic Products", "Spices", "Processed Foods", "Other"];
const INCOTERMS  = ["EXW", "FOB", "CIF", "CFR", "DAP", "DDP", "CPT", "CIP", "FCA"];
const PAY_TERMS  = ["LC", "TT", "DP", "DA", "Advance", "CAD"];

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition";
const labelCls  = "block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const sectionCls = "bg-white rounded-2xl border border-gray-100 p-6 md:p-8";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);

  const [form, setForm] = useState({
    name: "", slug: "", category: "", shortDescription: "", fullDescription: "",
    images: [] as string[], scientificName: "", hsCode: "", origin: "", shelfLife: "", leadTime: "",
    availableGradesText: "", certificationsText: "", packagingOptionsText: "",
    exportMarketsText: "", moq: "", containerCapacity: "",
    incotermsSupported: [] as string[], paymentTerms: [] as string[],
    privateLabelAvailable: false, sampleAvailable: false,
    status: "draft" as ProductStatus,
  });
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function load() {
      const res  = await fetch(`/api/v1/products/${id}?admin=true`, { credentials: "include" });
      const data = await res.json();
      if (!data.success) { toast.error("Product not found"); router.push("/admin/products"); return; }

      const p: IProduct = data.data;
      setProduct(p);

      setForm({
        name: p.name, slug: p.slug, category: p.category,
        shortDescription: p.shortDescription, fullDescription: p.fullDescription ?? "",
        images:              p.images || [],
        scientificName:      p.scientificName    || "",
        hsCode:              p.hsCode            || "",
        origin:              p.origin            || "",
        shelfLife:           p.shelfLife         || "",
        leadTime:            p.leadTime          || "",
        availableGradesText: p.availableGrades?.join(", ")   || "",
        certificationsText:  p.certifications?.join(", ")    || "",
        packagingOptionsText:p.packagingOptions?.join(", ")  || "",
        exportMarketsText:   p.exportMarkets?.join(", ")     || "",
        moq:                 p.moq               || "",
        containerCapacity:   p.containerCapacity || "",
        incotermsSupported:  p.incotermsSupported || [],
        paymentTerms:        p.paymentTerms       || [],
        privateLabelAvailable: p.privateLabelAvailable ?? false,
        sampleAvailable:       p.sampleAvailable ?? false,
        status:              p.status,
      });
      setSpecs(p.specifications?.length ? p.specifications : [{ label: "", value: "" }]);
      setLoading(false);
    }
    load();
  }, [id, router]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function toggleArr(key: "incotermsSupported" | "paymentTerms", val: string) {
    setForm((f) => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  function addSpec()              { setSpecs((s) => [...s, { label: "", value: "" }]); }
  function removeSpec(i: number)  { setSpecs((s) => s.filter((_, idx) => idx !== i)); }
  function updateSpec(i: number, k: "label" | "value", v: string) {
    setSpecs((s) => { const n = [...s]; n[i] = { ...n[i], [k]: v }; return n; });
  }

  function split(text: string): string[] {
    return text.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function save(status: ProductStatus) {
    if (!product) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name, category: form.category,
        shortDescription: form.shortDescription, fullDescription: form.fullDescription,
        images:            form.images,
        scientificName:    form.scientificName, hsCode: form.hsCode, origin: form.origin,
        shelfLife:         form.shelfLife,       leadTime: form.leadTime,
        availableGrades:   split(form.availableGradesText),
        certifications:    split(form.certificationsText),
        packagingOptions:  split(form.packagingOptionsText),
        exportMarkets:     split(form.exportMarketsText),
        moq:               form.moq,   containerCapacity: form.containerCapacity,
        incotermsSupported: form.incotermsSupported,
        paymentTerms:       form.paymentTerms,
        privateLabelAvailable: form.privateLabelAvailable,
        sampleAvailable:       form.sampleAvailable,
        specifications: specs.filter((s) => s.label && s.value),
        status,
      };

      const res  = await fetch(`/api/v1/products/${product.slug}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(status === "published" ? "Product published!" : "Draft saved");
        router.push("/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch { toast.error("Network error"); }
    finally  { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <a href="/admin/products" className="text-[12px] text-gray-400 hover:text-gray-700 transition">← Products</a>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Edit Product</h1>
        </div>
      </div>

      <div className="space-y-6">
        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-6">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select required className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Short Description *</label>
              <textarea required rows={2} className={inputCls} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.sampleAvailable} onChange={(e) => set("sampleAvailable", e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-[13px] font-medium text-gray-700">Sample Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.privateLabelAvailable} onChange={(e) => set("privateLabelAvailable", e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-[13px] font-medium text-gray-700">Private Label</span>
              </label>
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-6">Product Details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Scientific Name</label><input className={inputCls} value={form.scientificName} onChange={(e) => set("scientificName", e.target.value)} /></div>
            <div><label className={labelCls}>HS Code</label><input className={inputCls} value={form.hsCode} onChange={(e) => set("hsCode", e.target.value)} /></div>
            <div><label className={labelCls}>Origin</label><input className={inputCls} value={form.origin} onChange={(e) => set("origin", e.target.value)} /></div>
            <div><label className={labelCls}>Shelf Life</label><input className={inputCls} value={form.shelfLife} onChange={(e) => set("shelfLife", e.target.value)} /></div>
            <div><label className={labelCls}>Lead Time</label><input className={inputCls} value={form.leadTime} onChange={(e) => set("leadTime", e.target.value)} /></div>
            <div><label className={labelCls}>MOQ</label><input className={inputCls} value={form.moq} onChange={(e) => set("moq", e.target.value)} /></div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-4">Full Description</h2>
          <textarea rows={8} className={inputCls} value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} />
        </div>

        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-4">Product Images</h2>
          <MultiImageUpload
            values={form.images}
            onChange={(urls) => set("images", urls)}
            folder="products"
          />
        </div>

        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-6">Grades & Certifications</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Available Grades</label><input className={inputCls} value={form.availableGradesText} onChange={(e) => set("availableGradesText", e.target.value)} /></div>
            <div><label className={labelCls}>Certifications</label><input className={inputCls} value={form.certificationsText} onChange={(e) => set("certificationsText", e.target.value)} /></div>
          </div>
        </div>

        <div className={sectionCls}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-gray-900 text-[17px]">Technical Specifications</h2>
            <button onClick={addSpec} className="flex items-center gap-1.5 text-orange-500 text-[13px] font-semibold hover:text-orange-600 transition">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
          <div className="space-y-3">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input className={`flex-1 ${inputCls}`} placeholder="Parameter" value={s.label} onChange={(e) => updateSpec(i, "label", e.target.value)} />
                <input className={`flex-1 ${inputCls}`} placeholder="Value" value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} />
                <button onClick={() => removeSpec(i)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0"><Minus className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-6">Packaging & Logistics</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2"><label className={labelCls}>Packaging Options</label><input className={inputCls} value={form.packagingOptionsText} onChange={(e) => set("packagingOptionsText", e.target.value)} /></div>
            <div><label className={labelCls}>Container Capacity</label><input className={inputCls} value={form.containerCapacity} onChange={(e) => set("containerCapacity", e.target.value)} /></div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-black text-gray-900 text-[17px] mb-6">Export Information</h2>
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Supported Incoterms</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {INCOTERMS.map((t) => (
                  <button key={t} type="button" onClick={() => toggleArr("incotermsSupported", t)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition ${form.incotermsSupported.includes(t) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Payment Terms</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PAY_TERMS.map((t) => (
                  <button key={t} type="button" onClick={() => toggleArr("paymentTerms", t)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition ${form.paymentTerms.includes(t) ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div><label className={labelCls}>Export Markets</label><input className={inputCls} value={form.exportMarketsText} onChange={(e) => set("exportMarketsText", e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 mt-8 bg-white border-t border-gray-100 px-6 py-4 flex items-center gap-3 z-20">
        <button onClick={() => save("draft")} disabled={saving} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-[13px] hover:bg-gray-50 transition disabled:opacity-60">
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button onClick={() => save("published")} disabled={saving} className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-[13px] hover:bg-orange-600 transition shadow-lg shadow-orange-200 disabled:opacity-60">
          {saving ? "Saving..." : "Publish"}
        </button>
        <a href="/admin/products" className="ml-auto text-[13px] text-gray-400 hover:text-gray-700 transition">Cancel</a>
      </div>
    </div>
  );
}
