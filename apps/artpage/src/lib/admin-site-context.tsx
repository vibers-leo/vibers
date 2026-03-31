"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getAllSlugs, getTemplateConfig, type TemplateConfig } from "./templates";

type AdminSiteContextType = {
  currentSite: string;
  setCurrentSite: (slug: string) => void;
  config: TemplateConfig;
  allSites: string[];
};

const AdminSiteContext = createContext<AdminSiteContextType | null>(null);

export function AdminSiteProvider({ children }: { children: React.ReactNode }) {
  const allSites = getAllSlugs();
  const [currentSite, setCurrentSiteState] = useState(allSites[0] || "arthyun");

  // localStorage에서 복원
  useEffect(() => {
    const saved = localStorage.getItem("admin_current_site");
    if (saved && allSites.includes(saved)) {
      setCurrentSiteState(saved);
    }
  }, [allSites]);

  const setCurrentSite = useCallback((slug: string) => {
    setCurrentSiteState(slug);
    localStorage.setItem("admin_current_site", slug);
  }, []);

  const config = getTemplateConfig(currentSite) || getTemplateConfig("arthyun")!;

  return (
    <AdminSiteContext.Provider value={{ currentSite, setCurrentSite, config, allSites }}>
      {children}
    </AdminSiteContext.Provider>
  );
}

export function useAdminSite() {
  const ctx = useContext(AdminSiteContext);
  if (!ctx) throw new Error("useAdminSite must be used within AdminSiteProvider");
  return ctx;
}
