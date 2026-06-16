"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare, FileText, Clock, CheckCircle, PenLine, TrendingUp,
  ClipboardList, UserCheck, Package, Star,
} from "lucide-react";
import { formatDate } from "@/shared/lib/utils";

interface Stats {
  quotes: { total: number; pending: number; reviewing: number };
  blog:   { total: number; published: number; drafts: number };
  rfq:    { total: number; new: number; won: number };
  downloadLeads: { total: number };
  recentQuotes: Array<{
    _id: string;
    name: string;
    email: string;
    company?: string;
    product?: string;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  reviewing: "bg-blue-50 text-blue-700 border border-blue-200",
  responded: "bg-green-50 text-green-700 border border-green-200",
  closed:    "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function AdminDashboard() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total RFQs",       value: stats.rfq.total,          icon: ClipboardList, color: "bg-orange-50 text-orange-600", href: "/admin/rfq" },
        { label: "New RFQs",         value: stats.rfq.new,            icon: MessageSquare, color: "bg-blue-50 text-blue-600",     href: "/admin/rfq" },
        { label: "Deals Won",        value: stats.rfq.won,            icon: Star,          color: "bg-green-50 text-green-600",   href: "/admin/rfq" },
        { label: "Download Leads",   value: stats.downloadLeads.total, icon: UserCheck,     color: "bg-purple-50 text-purple-600", href: "/admin/download-leads" },
        { label: "Quote Requests",   value: stats.quotes.total,       icon: MessageSquare, color: "bg-yellow-50 text-yellow-600", href: "/admin/quotes" },
        { label: "Pending Replies",  value: stats.quotes.pending,     icon: Clock,         color: "bg-red-50 text-red-500",       href: "/admin/quotes" },
        { label: "Published Posts",  value: stats.blog.published,     icon: CheckCircle,   color: "bg-teal-50 text-teal-600",    href: "/admin/blog" },
        { label: "Draft Posts",      value: stats.blog.drafts,        icon: PenLine,       color: "bg-indigo-50 text-indigo-600", href: "/admin/blog" },
      ]
    : [];

  const quickActions = [
    { href: "/admin/products/new",  icon: Package,       label: "Add New Product",       desc: "Publish to product catalog" },
    { href: "/admin/rfq",           icon: ClipboardList, label: "View RFQ Pipeline",     desc: "Manage buyer quote requests" },
    { href: "/admin/downloads",     icon: FileText,      label: "Manage Downloads",      desc: "Upload catalogs and brochures" },
    { href: "/admin/blog/new",      icon: PenLine,       label: "Write New Article",     desc: "Create and publish a blog post" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your B2B export platform activity</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-100 rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, href }) => (
            <a key={label} href={href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-orange-100 transition-all">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900">{value}</p>
            </a>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map(({ href, icon: Icon, label, desc }) => (
          <a key={href} href={href} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group">
            <div className="w-11 h-11 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-500 transition-colors flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-[14px] truncate">{label}</p>
              <p className="text-gray-500 text-[12px] truncate">{desc}</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-orange-400 transition-colors" />
          </a>
        ))}
      </div>

      {/* Recent quote requests */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900 text-[15px]">Recent Legacy Inquiries</h2>
          <a href="/admin/quotes" className="text-[13px] font-semibold text-orange-500 hover:text-orange-600 transition">
            View all →
          </a>
        </div>
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                <div className="h-4 bg-gray-100 rounded flex-1" />
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : stats?.recentQuotes?.length ? (
          <div className="divide-y divide-gray-50">
            {stats.recentQuotes.map((q) => (
              <div key={q._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-[14px] truncate">{q.name}</p>
                  <p className="text-gray-500 text-[12px] truncate">
                    {q.email}{q.company ? ` · ${q.company}` : ""}{q.product ? ` · ${q.product}` : ""}
                  </p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[q.status]}`}>
                  {q.status}
                </span>
                <span className="text-[12px] text-gray-400 whitespace-nowrap hidden sm:block">
                  {formatDate(q.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-[14px]">No inquiries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
