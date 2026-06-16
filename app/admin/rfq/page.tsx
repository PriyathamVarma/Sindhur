"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Trash2, Mail, MessageSquare } from "lucide-react";
import type { IRFQ, RFQStatus } from "@/shared/interfaces/mongodb/rfq/rfq";
import { formatDate } from "@/shared/lib/utils";
import toast from "react-hot-toast";

const STATUSES: { key: RFQStatus | "all"; label: string }[] = [
  { key: "all",            label: "All"            },
  { key: "new",            label: "New"            },
  { key: "contacted",      label: "Contacted"      },
  { key: "negotiation",    label: "Negotiation"    },
  { key: "sample_sent",    label: "Sample Sent"    },
  { key: "quotation_sent", label: "Quotation Sent" },
  { key: "won",            label: "Won"            },
  { key: "lost",           label: "Lost"           },
];

const STATUS_STYLE: Record<string, string> = {
  new:            "bg-blue-50 text-blue-700 border-blue-200",
  contacted:      "bg-purple-50 text-purple-700 border-purple-200",
  negotiation:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  sample_sent:    "bg-orange-50 text-orange-700 border-orange-200",
  quotation_sent: "bg-indigo-50 text-indigo-700 border-indigo-200",
  won:            "bg-green-50 text-green-700 border-green-200",
  lost:           "bg-red-50 text-red-700 border-red-200",
};

interface RFQRow extends IRFQ {
  _id: string;
  createdAt: string;
}

export default function AdminRFQPage() {
  const [rfqs, setRFQs]         = useState<RFQRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatus] = useState<RFQStatus | "all">("all");
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving]     = useState<string | null>(null);
  const [notes, setNotes]       = useState<Record<string, string>>({});
  const [editStatus, setEdit]   = useState<Record<string, RFQStatus>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const qs  = statusFilter !== "all" ? `&status=${statusFilter}` : "";
    const sq  = search ? `&search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/v1/rfq?limit=100${qs}${sq}`, { credentials: "include" });
    const data = await res.json();
    if (data.success) {
      setRFQs(data.data.items);
      const n: Record<string, string> = {};
      const s: Record<string, RFQStatus> = {};
      data.data.items.forEach((r: RFQRow) => { n[r._id] = r.adminNotes || ""; s[r._id] = r.status; });
      setNotes(n); setEdit(s);
    }
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  async function saveRow(rfq: RFQRow) {
    setSaving(rfq._id);
    const res  = await fetch(`/api/v1/rfq/${rfq._id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body:    JSON.stringify({ status: editStatus[rfq._id], adminNotes: notes[rfq._id] }),
    });
    const data = await res.json();
    if (data.success) toast.success("RFQ updated");
    else toast.error(data.message);
    setSaving(null);
    load();
  }

  async function deleteRFQ(rfq: RFQRow) {
    if (!confirm(`Delete RFQ from ${rfq.buyerName}?`)) return;
    const res  = await fetch(`/api/v1/rfq/${rfq._id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) { toast.success("RFQ deleted"); setRFQs((r) => r.filter((x) => x._id !== rfq._id)); }
    else toast.error(data.message);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">RFQ Pipeline</h1>
        <p className="text-gray-500 text-sm mt-1">Manage buyer quote requests from inquiry to close</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 no-scrollbar">
        {STATUSES.map(({ key, label }) => {
          const count = key === "all" ? rfqs.length : rfqs.filter((r) => r.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                statusFilter === key
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${statusFilter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text"
          placeholder="Search by name, company, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                <div className="flex-1 h-4 bg-gray-100 rounded" /><div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : rfqs.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-[14px]">No RFQs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rfqs.map((rfq) => {
              const open = expanded === rfq._id;
              return (
                <div key={rfq._id}>
                  {/* Row header */}
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(open ? null : rfq._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[14px] truncate">
                        {rfq.buyerName} · {rfq.companyName}
                      </p>
                      <p className="text-gray-500 text-[12px] truncate">
                        {rfq.email} · {rfq.country} · {rfq.productInterested}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap hidden sm:block ${STATUS_STYLE[rfq.status] || ""}`}>
                      {rfq.status.replace("_", " ")}
                    </span>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap hidden md:block">
                      {formatDate(rfq.createdAt)}
                    </span>
                    {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </div>

                  {/* Expanded detail */}
                  {open && (
                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 space-y-5">
                      {/* Details grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          ["Business Type",   rfq.businessType],
                          ["Product",        rfq.productInterested],
                          ["Quantity",       rfq.quantityRequired],
                          ["Target Price",   rfq.targetPrice],
                          ["Destination Port", rfq.destinationPort],
                          ["Incoterm",       rfq.preferredIncoterm],
                          ["Packaging",      rfq.packagingRequirements],
                          ["Custom Req.",    rfq.customRequirements],
                          ["Phone",          rfq.phone],
                        ].filter(([, v]) => v).map(([k, v]) => (
                          <div key={k} className="bg-white rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{k}</p>
                            <p className="text-[13px] text-gray-900 font-medium mt-0.5">{v}</p>
                          </div>
                        ))}
                      </div>

                      {rfq.message && (
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                          <p className="text-[13px] text-gray-700 leading-relaxed">{rfq.message}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                          <select
                            value={editStatus[rfq._id] || rfq.status}
                            onChange={(e) => setEdit((s) => ({ ...s, [rfq._id]: e.target.value as RFQStatus }))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                          >
                            {STATUSES.filter((s) => s.key !== "all").map(({ key, label }) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Admin Notes</label>
                          <textarea
                            rows={1}
                            value={notes[rfq._id] || ""}
                            onChange={(e) => setNotes((n) => ({ ...n, [rfq._id]: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition resize-none"
                            placeholder="Internal notes..."
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => saveRow(rfq)}
                          disabled={saving === rfq._id}
                          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-[13px] hover:bg-orange-600 transition disabled:opacity-60"
                        >
                          {saving === rfq._id ? "Saving..." : "Save Changes"}
                        </button>
                        <a
                          href={`mailto:${rfq.email}?subject=Re: Your RFQ for ${rfq.productInterested}&body=Dear ${rfq.buyerName},%0A%0A`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-[13px] hover:border-orange-300 hover:text-orange-500 transition"
                        >
                          <Mail className="w-4 h-4" /> Email
                        </a>
                        {rfq.phone && (
                          <a
                            href={`https://wa.me/${rfq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${rfq.buyerName}, this is Sindhur Exports regarding your RFQ for ${rfq.productInterested}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] hover:bg-[#1ebe5d] transition"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => deleteRFQ(rfq)}
                          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 text-[13px] font-semibold transition"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
