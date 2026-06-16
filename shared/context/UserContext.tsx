"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface ILoggedinUser {
  id: string;
  name?: string;
  email: string;
  role?: string;
  authProvider?: "credentials" | "google";
  avatarUrl?: string;
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
  const [user, setUser] = useState<ILoggedinUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (u: ILoggedinUser) => {
    setUser(u);
    try { localStorage.setItem("se_user", JSON.stringify(u)); } catch {}
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem("se_user");
      await createClient().auth.signOut();
      await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
  };

  useEffect(() => {
    let mounted = true;
    async function rehydrate() {
      let cachedUser: ILoggedinUser | null = null;

      try {
        const raw = localStorage.getItem("se_user");
        cachedUser = raw ? JSON.parse(raw) : null;
        if (cachedUser && mounted) setUser(cachedUser);
      } catch {
        localStorage.removeItem("se_user");
      }

      try {
        const res = await fetch("/api/v1/auth/me", { credentials: "include" });
        if (!res.ok) {
          localStorage.removeItem("se_user");
          if (mounted) setUser(null);
          return;
        }

        const payload = await res.json();
        if (payload?.success && payload.data && mounted) {
          const s = payload.data;
          const nextUser = {
            id: s.id ?? String(s._id),
            name: s.name,
            email: s.email,
            role: s.role,
            authProvider: s.authProvider,
            avatarUrl: s.avatarUrl,
          };
          setUser(nextUser);
          localStorage.setItem("se_user", JSON.stringify(nextUser));
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
