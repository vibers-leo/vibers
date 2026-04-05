"use client";

import React, { useState, useMemo } from "react";
import { User, Bell, Search, LayoutDashboard, ChevronDown, Check, Globe } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { VIBERS_PROJECTS_REGISTRY } from "@/lib/admin/aggregator";

const TOTAL_PROJECT = { slug: "total", name: "전체 대시보드", group: "" };

export default function Header() {
  const { currentProject, setCurrentProject } = useProject();
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  const grouped = useMemo(() => {
    const map: Record<string, typeof VIBERS_PROJECTS_REGISTRY> = {};
    for (const p of VIBERS_PROJECTS_REGISTRY) {
      if (!map[p.group]) map[p.group] = [];
      map[p.group].push(p);
    }
    return map;
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[var(--admin-card)] border-b border-[var(--admin-border)] shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsProjectOpen(!isProjectOpen)}
            className="flex items-center gap-2 bg-[var(--admin-bg)] px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-[var(--admin-accent)] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-[var(--admin-accent)]" />
            <span className="text-sm font-semibold text-[var(--admin-text)]">{currentProject.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[var(--admin-text-muted)] transition-transform ${isProjectOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProjectOpen && (
            <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-[var(--admin-border)] rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
              {/* 전체 대시보드 */}
              <button
                onClick={() => { setCurrentProject(TOTAL_PROJECT as any); setIsProjectOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--admin-bg)] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  <span className={currentProject.slug === "total" ? "text-[var(--admin-accent)] font-bold" : "text-[var(--admin-text)]"}>
                    전체 대시보드
                  </span>
                </span>
                {currentProject.slug === "total" && <Check className="w-3.5 h-3.5 text-[var(--admin-accent)]" />}
              </button>

              <div className="my-1 border-t border-[var(--admin-border)]" />

              {/* 그룹별 */}
              {Object.entries(grouped).map(([group, projects]) => (
                <div key={group}>
                  <div className="px-3 py-1.5 text-[10px] font-black text-[var(--admin-text-muted)] uppercase tracking-[0.15em]">
                    — {group} —
                  </div>
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentProject({ slug: p.id, name: p.name, domain: p.domain, apiUrl: p.adminApiUrl } as any);
                        setIsProjectOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--admin-bg)] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color ?? "#94a3b8" }} />
                        <span className={currentProject.slug === p.id ? "text-[var(--admin-accent)] font-bold" : "text-[var(--admin-text)]"}>
                          {p.name}
                        </span>
                      </span>
                      {currentProject.slug === p.id && <Check className="w-3.5 h-3.5 text-[var(--admin-accent)]" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--admin-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="통합 검색..." 
            className="pl-9 pr-4 py-1.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-full text-sm focus:outline-none focus:border-[var(--admin-accent)] transition-colors w-64"
          />
        </div>
        <button className="relative p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--admin-danger)]"></span>
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-[var(--admin-border)] text-slate-700">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
