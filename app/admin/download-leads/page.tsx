"use client";

import { useEffect, useState } from "react";
import { UserCheck, Trash2, Mail } from "lucide-react";
import type { IDownloadLead } from "@/shared/interfaces/mongodb/downloads/downloadLead";
import { formatDate } from "@/shared/lib/utils";
import toast from "react-hot-toast";

interface LeadRow extends Omit<IDownloadLead, "createdAt"> { _id: string; createdAt: string }

export default function AdminDownloadLeadsPage() {
  const [leads, setLeads]     = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const LIMIT = 30;

  async function load(p = 1) {
    setLoading(true);
    const res  = await fetch(`/api/v1/download-leads?page=${p}&limit=${LIMIT}`, { credentials: "include" });
    const data = await res.json();
    if (data.success) { setLeads(data.data.items); setTotal(data.data.meta.total); }
    setLoading(false);
  }

  useEffect(() => { load(page); }, [page]);

  async function deleteLead(lead: LeadRow) {
    if (!confirm(`Delete lead from ${lead.name}?`)) return;
    const res  = await fetch(`/api/v1/download-leads/${lead._id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) { toast.success("Lead deleted"); setLeads((l) => l.filter((x) => x._id !== lead._id)); }
    else toast.error(data.message);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Download Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total leads captured from gated downloads</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-gray-50 hidden sm:grid">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</p>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company / Country</p>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider col-span-2">Downloaded</p>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">{Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 animate-pulse flex gap-4"><div className="flex-1 h-4 bg-gray-100 rounded" /></div>
          ))}</div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center">
            <UserCheck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-[14px]">No download leads captured yet.</p>
            <p className="text-gray-400 text-[12px] mt-1">Leads appear when visitors download gated resources.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <div key={lead._id} className="grid sm:grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900 text-[14px] truncate">{lead.name}</p>
                  <a href={`mailto:${lead.email}`} className="text-orange-500 text-[12px] hover:text-orange-600 transition">{lead.email}</a>
                </div>
                <div>
                  <p className="text-gray-700 text-[13px] truncate">{lead.company || "—"}</p>
                  <p className="text-gray-400 text-[12px]">{lead.country || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-900 text-[13px] font-medium truncate">{lead.downloadTitle}</p>
                  {lead.phone && <p className="text-gray-400 text-[12px]">{lead.phone}</p>}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-400 text-[12px]">{formatDate(lead.createdAt)}</p>
                  <div className="flex items-center gap-1">
                    <a href={`mailto:${lead.email}`} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition" title="Email">
                      <Mail className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteLead(lead)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {total > LIMIT && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
            <p className="text-[13px] text-gray-500">Page {page} of {Math.ceil(total / LIMIT)}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">Previous</button>
              <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
