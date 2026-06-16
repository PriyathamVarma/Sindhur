"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/shared/lib/utils";
import type { IQuoteRequest, QuoteStatus } from "@/shared/interfaces/mongodb/quotes/quoteRequest";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTS: { label: string; value: QuoteStatus | "" }[] = [
  { label: "All",       value: "" },
  { label: "Pending",   value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Responded", value: "responded" },
  { label: "Closed",    value: "closed" },
];

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  reviewing: "bg-blue-50 text-blue-700 border border-blue-200",
  responded: "bg-green-50 text-green-700 border border-green-200",
  closed:    "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function QuotesPage() {
  const [quotes, setQuotes]     = useState<IQuoteRequest[]>([]);
  const [filter, setFilter]     = useState<QuoteStatus | "">("");
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes]       = useState<Record<string, string>>({});
  const [saving, setSaving]     = useState<string | null>(null);

  const fetchQuotes = (status?: string) => {
    setLoading(true);
    const url = `/api/v1/quotes${status ? `?status=${status}` : ""}`;
    fetch(url, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setQuotes(d.data.items);
          const initNotes: Record<string, string> = {};
          d.data.items.forEach((q: IQuoteRequest) => {
            initNotes[q._id!] = q.adminNotes || "";
          });
          setNotes(initNotes);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuotes(filter || undefined); }, [filter]);

  const updateQuote = async (id: string, patch: Partial<IQuoteRequest>) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/v1/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (data.success) {
        setQuotes((prev) => prev.map((q) => (q._id === id ? { ...q, ...patch } : q)));
        toast.success("Updated");
      } else {
        toast.error(data.message);
      }
    } finally {
      setSaving(null);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const res = await fetch(`/api/v1/quotes/${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) {
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      toast.success("Deleted");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quote Requests</h1>
          <p className="text-gray-500 text-sm mt-1">{quotes.length} {filter || "total"} inquiries</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value as any)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
              filter === value
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <p className="text-gray-400">No quote requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => {
            const isOpen = expanded === q._id;
            return (
              <div key={q._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : q._id!)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-[14px]">{q.name}</p>
                      {q.company && <span className="text-[12px] text-gray-400">· {q.company}</span>}
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5 truncate">{q.email}{q.product ? ` · ${q.product}` : ""}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap hidden sm:block ${STATUS_COLORS[q.status]}`}>
                    {q.status}
                  </span>
                  <span className="text-[12px] text-gray-400 whitespace-nowrap hidden md:block">
                    {formatDate(q.createdAt!)}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-50 px-5 py-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-400 font-medium">Email:</span> <a href={`mailto:${q.email}`} className="text-orange-500 hover:underline">{q.email}</a></div>
                      {q.company  && <div><span className="text-gray-400 font-medium">Company:</span> <span className="text-gray-700">{q.company}</span></div>}
                      {q.country  && <div><span className="text-gray-400 font-medium">Country:</span> <span className="text-gray-700">{q.country}</span></div>}
                      {q.product  && <div><span className="text-gray-400 font-medium">Product:</span> <span className="text-gray-700">{q.product}</span></div>}
                      <div><span className="text-gray-400 font-medium">Received:</span> <span className="text-gray-700">{formatDate(q.createdAt!)}</span></div>
                    </div>

                    {q.message && (
                      <div>
                        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                        <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-4 leading-relaxed">{q.message}</p>
                      </div>
                    )}

                    {/* Status + notes */}
                    <div className="flex flex-wrap gap-3 items-end">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={q.status}
                          onChange={(e) => updateQuote(q._id!, { status: e.target.value as QuoteStatus })}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          {["pending", "reviewing", "responded", "closed"].map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Admin Notes</label>
                        <input
                          type="text"
                          value={notes[q._id!] ?? ""}
                          onChange={(e) => setNotes((p) => ({ ...p, [q._id!]: e.target.value }))}
                          placeholder="Internal note..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>

                      <button
                        onClick={() => updateQuote(q._id!, { adminNotes: notes[q._id!] })}
                        disabled={saving === q._id}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold rounded-xl transition disabled:opacity-60"
                      >
                        {saving === q._id ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => deleteQuote(q._id!)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
}
