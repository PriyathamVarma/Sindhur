"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ILoggedinUser {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

interface IUserContext {
  user: ILoggedinUser | null;
  login: (u: ILoggedinUser) => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<IUserContext>({
  user: null, login: () => {}, logout: () => {}, loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ILoggedinUser | null>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("se_user");
        return raw ? JSON.parse(raw) : null;
      }
    } catch { if (typeof window !== "undefined") localStorage.removeItem("se_user"); }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = (u: ILoggedinUser) => {
    setUser(u);
    try { localStorage.setItem("se_user", JSON.stringify(u)); } catch {}
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem("se_user");
      await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
  };

  useEffect(() => {
    let mounted = true;
    async function rehydrate() {
      if (user) return;
      setLoading(true);
      try {
        const res = await fetch("/api/v1/auth/me", { credentials: "include" });
        if (!res.ok) return;
        const payload = await res.json();
        if (payload?.success && payload.data && mounted) {
          const s = payload.data;
          login({ id: s.id ?? String(s._id), name: s.name, email: s.email, role: s.role });
        }
      } catch {}
      finally { if (mounted) setLoading(false); }
    }
    rehydrate();
    return () => { mounted = false; };
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
