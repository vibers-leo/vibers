'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { canAccessAdmin } from "@/lib/permissions";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
}

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => void;
  loginWithNaver: () => void;
  loginWithKakao: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = () => {
    const redirect = window.location.pathname;
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirect)}`;
  };

  const loginWithNaver = () => {
    const redirect = window.location.pathname;
    window.location.href = `/api/auth/naver?redirect=${encodeURIComponent(redirect)}`;
  };

  const loginWithKakao = () => {
    const redirect = window.location.pathname;
    window.location.href = `/api/auth/kakao?redirect=${encodeURIComponent(redirect)}`;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  };

  const isAdmin = user ? canAccessAdmin(user.role) : false;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, loginWithGoogle, loginWithNaver, loginWithKakao, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다");
  return context;
}
