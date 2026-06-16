"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/shared/context/UserContext";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";

const NAV = [
  { href: "/admin",        label: "Dashboard",      icon: LayoutDashboard },
  { href: "/admin/quotes", label: "Quote Requests",  icon: MessageSquare },
  { href: "/admin/blog",   label: "Blog Posts",      icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-base">SE</span>
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">SE</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[14px] text-gray-900 tracking-tight">Sindhur Exports</span>
            <span className="text-[10px] text-orange-500 tracking-[0.12em] uppercase">Admin Panel</span>
          </div>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <a
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                active
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <Globe className="w-4 h-4" />
          View Website
        </a>
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <span className="text-orange-600 text-[11px] font-bold">{user.name?.[0]?.toUpperCase() || "A"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 truncate">{user.name || "Admin"}</p>
            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 fixed top-0 left-0 h-screen z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-2xl z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-[14px] text-gray-900">Sindhur Exports</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
