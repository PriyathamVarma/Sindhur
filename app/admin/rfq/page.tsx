"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Trash2, Mail, MessageSquare, Search, RefreshCw } from "lucide-react";
import type { IRFQ, RFQStatus } from "@/shared/interfaces/mongodb/rfq/rfq";
import { formatDate } from "@/shared/lib/utils";
import toast from "react-hot-toast";

const STATUSES: { key: RFQStatus | "all"; label: string; color: string }[] = [
  { key: "all",            label: "All",            color: "" },
  { key: "new",            label: "New",            color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "contacted",      label: "Contacted",      color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "negotiation",    label: "Negotiation",    color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { key: "sample_sent",    label: "Sample Sent",    color: "bg-orange-50 text-orange-700 border-orange-200" },
  { key: "quotation_sent", label: "Quotation Sent", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { key: "won",            label: "Won",            color: "bg-green-50 text-green-700 border-green-200" },
  { key: "lost",           label: "Lost",           color: "bg-red-50 text-red-700 border-red-200" },
];

interface RFQRow extends Omit<IRFQ, "createdAt" | "updatedAt"> {
  _id: string;
  createdAt: string;
}

export default function AdminRFQPage() {
  const [allRFQs, setAllRFQs]     = useState<RFQRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatus] = useState<RFQStatus | "all">("all");
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [saving, setSaving]       = useState<string | null>(null);
  const [notes, setNotes]         = useState<Record<string, string>>({});
  const [editStatus, setEdit]     = useState<Record<string, RFQStatus>>({});

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const res  = await fetch("/api/v1/rfq?limit=500", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const items: RFQRow[] = data.data.items;
        setAllRFQs(items);
        const n: Record<string, string>    = {};
        const s: Record<string, RFQStatus> = {};
        items.forEach((r) => { n[r._id] = r.adminNotes || ""; s[r._id] = r.status; });
        setNotes((prev) => ({ ...n, ...prev }));
        setEdit((prev)  => ({ ...s, ...prev }));
      } else {
        toast.error(data.message || "Failed to load RFQs");
      }
    } catch {
      toast.error("Network error loading RFQs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Client-side filtering — always accurate counts
  const searchLower = search.toLowerCase();
  const rfqs = allRFQs.filter((r) => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchSearch = !searchLower || (
      r.buyerName.toLowerCase().includes(searchLower)    ||
      r.companyName.toLowerCase().includes(searchLower)  ||
      r.email.toLowerCase().includes(searchLower)        ||
      r.productInterested.toLowerCase().includes(searchLower)
    );
    return matchStatus && matchSearch;
  });

  function countOf(key: RFQStatus | "all") {
    if (key === "all") return allRFQs.length;
    return allRFQs.filter((r) => r.status === key).length;
  }

  async function saveRow(rfq: RFQRow) {
    setSaving(rfq._id);
    try {
      const res  = await fetch(`/api/v1/rfq/${rfq._id}`, {
        method:      "PATCH",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body:        JSON.stringify({ status: editStatus[rfq._id], adminNotes: notes[rfq._id] }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("RFQ updated");
        // Update local state immediately without full reload
        setAllRFQs((prev) =>
          prev.map((r) =>
            r._id === rfq._id
              ? { ...r, status: editStatus[rfq._id], adminNotes: notes[rfq._id] }
              : r
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(null);
    }
  }

  async function deleteRFQ(rfq: RFQRow) {
    if (!confirm(`Delete RFQ from ${rfq.buyerName} (${rfq.companyName})?`)) return;
    try {
      const res  = await fetch(`/api/v1/rfq/${rfq._id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        toast.success("RFQ deleted");
        setAllRFQs((prev) => prev.filter((x) => x._id !== rfq._id));
        if (expanded === rfq._id) setExpanded(null);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete RFQ");
    }
  }

  const pipeline = STATUSES.filter((s) => s.key !== "all" && s.key !== "lost");
  const newCount   = countOf("new");
  const wonCount   = countOf("won");
  const lostCount  = countOf("lost");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">RFQ Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">
            {allRFQs.length} total · {newCount} new · {wonCount} won · {lostCount} lost
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-semibold hover:border-orange-300 hover:text-orange-500 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Pipeline stage summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {pipeline.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            className={`text-center p-3 rounded-xl border transition-all ${
              statusFilter === key
                ? "border-orange-400 bg-orange-50 ring-1 ring-orange-300"
                : "border-gray-100 bg-white hover:border-orange-200"
            }`}
          >
            <p className="text-xl font-black text-gray-900">{countOf(key)}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Won / Lost callout */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setStatus("won")}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${statusFilter === "won" ? "border-green-400 bg-green-50 ring-1 ring-green-300" : "border-gray-100 bg-white hover:border-green-200"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-2xl font-black text-green-700">{wonCount}</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Deals Won</p>
          </div>
        </button>
        <button
          onClick={() => setStatus("lost")}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${statusFilter === "lost" ? "border-red-400 bg-red-50 ring-1 ring-red-300" : "border-gray-100 bg-white hover:border-red-200"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-2xl font-black text-red-600">{lostCount}</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Deals Lost</p>
          </div>
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-4 no-scrollbar">
        {STATUSES.map(({ key, label }) => {
          const count = countOf(key);
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
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${statusFilter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, company, email, or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[13px]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {(statusFilter !== "all" || search) && (
        <p className="text-[13px] text-gray-400 mb-3">
          Showing {rfqs.length} of {allRFQs.length} RFQs
          {statusFilter !== "all" && ` · Status: ${STATUSES.find(s => s.key === statusFilter)?.label}`}
          {search && ` · Search: "${search}"`}
          <button onClick={() => { setStatus("all"); setSearch(""); }} className="ml-2 text-orange-500 hover:underline">Clear filters</button>
        </p>
      )}

      {/* RFQ list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : rfqs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-gray-200" />
            </div>
            <p className="text-gray-500 font-semibold text-[15px] mb-1">
              {allRFQs.length === 0 ? "No RFQs yet" : "No matches found"}
            </p>
            <p className="text-gray-400 text-[13px]">
              {allRFQs.length === 0
                ? "When buyers submit RFQs from /request-quote, they'll appear here."
                : "Try adjusting your filters or search query."}
            </p>
            {allRFQs.length > 0 && (
              <button
                onClick={() => { setStatus("all"); setSearch(""); }}
                className="mt-4 px-4 py-2 rounded-xl bg-orange-50 text-orange-500 text-[13px] font-semibold hover:bg-orange-100 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rfqs.map((rfq) => {
              const open       = expanded === rfq._id;
              const statusInfo = STATUSES.find((s) => s.key === rfq.status);

              return (
                <div key={rfq._id}>
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50/70 transition-colors"
                    onClick={() => setExpanded(open ? null : rfq._id)}
                  >
                    {/* Status dot */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      rfq.status === "new"            ? "bg-blue-500"   :
                      rfq.status === "contacted"      ? "bg-purple-500" :
                      rfq.status === "negotiation"    ? "bg-yellow-500" :
                      rfq.status === "sample_sent"    ? "bg-orange-500" :
                      rfq.status === "quotation_sent" ? "bg-indigo-500" :
                      rfq.status === "won"            ? "bg-green-500"  :
                                                        "bg-red-400"
                    }`} />

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[14px] truncate">
                        {rfq.buyerName}
                        <span className="text-gray-400 font-normal"> · {rfq.companyName}</span>
                      </p>
                      <p className="text-gray-500 text-[12px] truncate mt-0.5">
                        {rfq.email}
                        {rfq.country && <> · <span>{rfq.country}</span></>}
                        {rfq.productInterested && <> · <span className="text-orange-500">{rfq.productInterested}</span></>}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap hidden sm:block ${statusInfo?.color || ""}`}>
                        {rfq.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap hidden md:block">
                        {formatDate(rfq.createdAt)}
                      </span>
                      {open
                        ? <ChevronUp  className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {open && (
                    <div className="px-6 py-6 bg-gray-50/60 border-t border-gray-100 space-y-5">

                      {/* Buyer details */}
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Buyer Details</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {([
                            ["Business Type",    rfq.businessType],
                            ["Country",          rfq.country],
                            ["Phone",            rfq.phone],
                            ["Email",            rfq.email],
                          ] as [string, string | undefined][]).filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{k}</p>
                              <p className="text-[13px] text-gray-900 font-medium mt-0.5 break-all">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RFQ details */}
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">RFQ Details</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {([
                            ["Product",           rfq.productInterested],
                            ["Quantity",          rfq.quantityRequired],
                            ["Target Price",      rfq.targetPrice],
                            ["Destination Port",  rfq.destinationPort],
                            ["Incoterm",          rfq.preferredIncoterm],
                            ["Packaging",         rfq.packagingRequirements],
                          ] as [string, string | undefined][]).filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{k}</p>
                              <p className="text-[13px] text-gray-900 font-medium mt-0.5">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom requirements / message */}
                      {(rfq.customRequirements || rfq.message) && (
                        <div className="space-y-2.5">
                          {rfq.customRequirements && (
                            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Custom Requirements</p>
                              <p className="text-[13px] text-gray-700 leading-relaxed">{rfq.customRequirements}</p>
                            </div>
                          )}
                          {rfq.message && (
                            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                              <p className="text-[13px] text-gray-700 leading-relaxed">{rfq.message}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status + notes */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Pipeline Status</label>
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
                          <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Internal Notes</label>
                          <textarea
                            rows={2}
                            value={notes[rfq._id] || ""}
                            onChange={(e) => setNotes((n) => ({ ...n, [rfq._id]: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition resize-none"
                            placeholder="Internal notes, follow-up reminders..."
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          onClick={() => saveRow(rfq)}
                          disabled={saving === rfq._id}
                          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-[13px] hover:bg-orange-600 transition disabled:opacity-60 flex items-center gap-2"
                        >
                          {saving === rfq._id ? (
                            <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
                          ) : "Save Changes"}
                        </button>

                        <a
                          href={`mailto:${rfq.email}?subject=Re: Your RFQ for ${encodeURIComponent(rfq.productInterested)}&body=Dear ${rfq.buyerName},%0A%0AThank you for your interest in ${rfq.productInterested}.%0A%0A`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-[13px] hover:border-orange-300 hover:text-orange-500 transition"
                        >
                          <Mail className="w-4 h-4" /> Email
                        </a>

                        {rfq.phone && (
                          <a
                            href={`https://wa.me/${rfq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${rfq.buyerName}, this is Sindhur Exports regarding your RFQ for ${rfq.productInterested}. `)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] hover:bg-[#1ebe5d] transition"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
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

      {/* Footer hint when empty */}
      {!loading && allRFQs.length === 0 && (
        <div className="mt-6 p-5 bg-orange-50 border border-orange-100 rounded-2xl">
          <p className="text-[13px] text-orange-700 font-medium">
            <strong>How to get RFQs:</strong> Buyers fill the form at{" "}
            <a href="/request-quote" target="_blank" className="underline hover:text-orange-900">/request-quote</a>{" "}
            or click "Request Quote" on any product page. Submitted RFQs appear here instantly.
          </p>
        </div>
      )}
    </div>
  );
}
