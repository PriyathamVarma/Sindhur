"use client";

import { useEffect, useState } from "react";
import { Package, Plus, PenLine, Trash2, Globe, Eye, EyeOff } from "lucide-react";
import type { IProduct } from "@/shared/interfaces/mongodb/products/product";
import toast from "react-hot-toast";

const STATUS_BADGE: Record<string, string> = {
  published: "bg-green-50 text-green-700 border border-green-200",
  draft:     "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"all" | "published" | "draft">("all");

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/v1/products?admin=true&limit=100", { credentials: "include" });
    const data = await res.json();
    if (data.success) setProducts(data.data.items);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleStatus(product: IProduct) {
    const next = product.status === "published" ? "draft" : "published";
    const res  = await fetch(`/api/v1/products/${product.slug}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body:    JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(next === "published" ? "Product published" : "Moved to draft");
      load();
    } else {
      toast.error(data.message);
    }
  }

  async function deleteProduct(product: IProduct) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const res  = await fetch(`/api/v1/products/${product.slug}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) {
      toast.success("Product deleted");
      setProducts((p) => p.filter((x) => x._id !== product._id));
    } else {
      toast.error(data.message);
    }
  }

  const filtered = filter === "all" ? products : products.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your export product catalog</p>
        </div>
        <a
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-[13px] font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
        >
          <Plus className="w-4 h-4" />
          New Product
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all capitalize ${
              filter === f ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {f} {f === "all" ? `(${products.length})` : `(${products.filter((p) => p.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-[14px]">
              {filter === "all" ? "No products yet." : `No ${filter} products.`}
            </p>
            <a href="/admin/products/new" className="mt-4 inline-block text-orange-500 text-[13px] font-semibold hover:text-orange-600 transition">
              + Add your first product
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((product) => {
              const thumb = product.images?.[0];
              return (
                <div key={String(product._id)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {thumb ? (
                      <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-[14px] truncate">{product.name}</p>
                    <p className="text-gray-400 text-[12px]">{product.category}</p>
                  </div>

                  {/* Status */}
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap hidden sm:block ${STATUS_BADGE[product.status]}`}>
                    {product.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {product.status === "published" && (
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="View live"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => toggleStatus(product)}
                      className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                      title={product.status === "published" ? "Unpublish" : "Publish"}
                    >
                      {product.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <a
                      href={`/admin/products/${product._id}/edit`}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                      title="Edit"
                    >
                      <PenLine className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteProduct(product)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
